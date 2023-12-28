from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from models import (
    Outfit,
    Comment,
    User,
    OutfitHashtag,
    Follow,
    Notification,
    CommentAnswer,
    OutfitLink,
    OutfitImage,
)
from db import db
from datetime import datetime
from sqlalchemy import desc
from dotenv import load_dotenv
from core.s3 import upload_to_s3
from util import send_push_notification, is_valid_url
from sqlalchemy import or_
from core.search import search_outfits, search_outfits_by_hashtag
import uuid

load_dotenv()


def create_notification(user_id, action_type, entity_id, entity_type, sender_id):
    id = str(uuid.uuid4())
    notification = Notification(
        id=id,
        user_id=user_id,
        action_type=action_type,
        entity_id=entity_id,
        entity_type=entity_type,
        sender_id=sender_id,
    )
    db.session.add(notification)
    db.session.commit()


outfits_bp = Blueprint("outfits", __name__, url_prefix="/outfits")


# GET /outfits
@outfits_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_outfits() -> tuple[Response, int]:
    current_user_id = get_jwt_identity()

    accepted_follows = Follow.query.filter_by(
        follower_id=current_user_id, status="Accepted"
    ).all()
    accepted_followee_ids = [follow.followee_id for follow in accepted_follows]

    accepted_followee_ids.append(current_user_id)

    outfits = (
        Outfit.query.join(User, User.id == Outfit.user_id)
        .filter(
            or_(Outfit.user_id.in_(accepted_followee_ids), User.is_private == False)
        )
        .order_by(desc(Outfit.created_at))
        .all()
    )

    return jsonify([outfit.to_dict() for outfit in outfits]), 200


# GET /outfits/:id
@outfits_bp.route("/<id>", methods=["GET"])
@jwt_required()
def get_outfit(id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    return jsonify(outfit.to_dict()), 200


# GET /outfits/user/:id
@outfits_bp.route("/user/<id>", methods=["GET"])
@jwt_required()
def get_outfits_by_user(id: str) -> tuple[Response, int]:
    outfits = Outfit.query.filter_by(user_id=id).order_by(desc(Outfit.created_at)).all()

    if len(outfits) == 0:
        return jsonify({"message": "User has no outfits"}), 404

    return jsonify([outfit.to_dict() for outfit in outfits]), 200


# GET /outfits/search/:query
@outfits_bp.route("/search/<query>", methods=["GET"])
@jwt_required()
def search_outfits_route(query: str) -> tuple[Response, int]:
    outfits = Outfit.query.join(User, User.id == Outfit.user_id).all()

    if len(outfits) == 0:
        return jsonify({"message": "No outfits found"}), 404

    search_results = search_outfits([outfit.to_dict() for outfit in outfits], query)

    if len(search_results) == 0:
        return jsonify({"message": "No outfits found"}), 200

    return jsonify(search_results), 200


# GET /outfits/search/hashtag/:hashtag
@outfits_bp.route("/search/hashtag/<hashtag>", methods=["GET"])
@jwt_required()
def search_outfits_by_hashtag_route(query: str, hashtag: str) -> tuple[Response, int]:
    outfits = Outfit.query.join(User, User.id == Outfit.user_id).all()

    if len(outfits) == 0:
        return jsonify({"message": "No outfits found"}), 404

    search_results = search_outfits_by_hashtag(
        [outfit.to_dict() for outfit in outfits], query, hashtag.lower()
    )

    if len(search_results) == 0:
        return jsonify({"message": "No outfits found with the specified hashtag"}), 200

    return jsonify(search_results), 200


# POST /outfits/upload
@outfits_bp.route("/upload", methods=["POST"])
@jwt_required()
def create_outfit():
    data = request.get_json()

    fields = [
        "video_url",
        "description",
        "style",
        "hashtags",
        "outfit_links",
        "outfit_images",
    ]
    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    data["id"] = str(uuid.uuid4())
    data["user_id"] = get_jwt_identity()
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    hashtags = data["hashtags"]
    outfit_links = data["outfit_links"]
    outfit_images = data["outfit_images"]

    data.pop("hashtags")
    data.pop("outfit_links")
    data.pop("outfit_images")

    user = User.query.get(get_jwt_identity())

    current_time = datetime.utcnow()

    if user.last_upload_time:
        time_difference = current_time - user.last_upload_time

        if time_difference.days == 1:
            user.streak = 1 if user.streak is None else user.streak + 1
        else:
            user.streak = 1

    else:
        user.streak = 1

    user.last_upload_time = current_time

    outfit = Outfit(**data)
    db.session.add(outfit)
    db.session.flush()

    if hashtags is not None and type(hashtags) == list:
        for hashtag in hashtags:
            outfit_hashtag = OutfitHashtag(
                id=str(uuid.uuid4()), outfit_id=outfit.id, hashtag=hashtag
            )
            db.session.add(outfit_hashtag)

    if outfit_images is not None and type(outfit_images) == list:
        for outfit_image in outfit_images:
            img = {"image_url": None, "id": str(uuid.uuid4()), "outfit_id": outfit.id}

            img["image_url"] = upload_to_s3(outfit_image, outfit.id, "outfit_image")

            outfit_image = OutfitImage(**img)
            db.session.add(outfit_image)

    if outfit_links is not None and type(outfit_links) == list:
        for outfit_link in outfit_links:
            link = {
                "link": None,
                "id": str(uuid.uuid4()),
                "outfit_id": outfit.id,
                "description": outfit_link["description"],
                "link": outfit_link["link"],
            }

            if not is_valid_url(outfit_link["link"]):
                return jsonify({"message": "Invalid URL"}), 400

            outfit_link = OutfitLink(**link)
            db.session.add(outfit_link)

    db.session.commit()

    return jsonify(outfit.to_dict()), 201


# PUT /outfits/:id
@outfits_bp.route("/<id>", methods=["PUT"])
@jwt_required()
def update_outfit(id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    data = request.get_json()

    fields = ["photo_url", "video_url"]

    for field in fields:
        if field in data:
            setattr(outfit, field, data[field])

    outfit.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify(outfit.to_dict()), 200


# DELETE /outfits/:id
@outfits_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_outfit(id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    db.session.delete(outfit)
    db.session.commit()

    return jsonify({"message": "Outfit deleted"}), 200


# POST /outfits/:id/like
@outfits_bp.route("/<id>/like", methods=["POST"])
@jwt_required()
def like_outfit(id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user in outfit.likes:
        return jsonify({"message": "Outfit already liked"}), 400

    outfit.likes.append(user)

    if outfit.user_id != user_id:
        create_notification(outfit.user_id, "like", outfit.id, "outfit", user_id)
        send_push_notification(
            outfit.user.expo_push_token,
            "GotStyle",
            f"{user.username} liked your outfit!",
        )

    db.session.commit()

    return jsonify({"message": "Outfit liked"}), 200


# POST /outfits/:id/unlike
@outfits_bp.route("/<id>/unlike", methods=["POST"])
@jwt_required()
def unlike_outfit(id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user not in outfit.likes:
        return jsonify({"message": "Outfit not liked"}), 400

    outfit.likes.remove(user)

    db.session.commit()

    return jsonify({"message": "Outfit unliked"}), 200


# POST /outfits/:id/comment
@outfits_bp.route("/<id>/comment", methods=["POST"])
@jwt_required()
def comment_outfit(id: str) -> tuple[Response, int]:
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    data = request.get_json()

    if "text" not in data:
        return jsonify({"message": "Text is required"}), 400

    data["id"] = str(uuid.uuid4())
    data["user_id"] = get_jwt_identity()
    data["outfit_id"] = outfit.id
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()

    comment = Comment(**data)

    if outfit.user_id != user_id:
        create_notification(outfit.user_id, "comment", comment.id, "comment", user_id)
        if outfit.user.expo_push_token:
            send_push_notification(
                outfit.user.expo_push_token,
                "GotStyle",
                f"{user.username} commented on your outfit!",
            )

    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201


# GET /outfits/:id/comment/:comment_id
@outfits_bp.route("/<id>/comment/<comment_id>", methods=["GET"])
@jwt_required()
def get_comment(id: str, comment_id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({"message": "Comment not found"}), 404

    return jsonify(comment.to_dict()), 200


# POST /outfits/:id/comment/:comment_id/reply/:reply_id/like
@outfits_bp.route("/<id>/comment/<comment_id>/reply/<reply_id>/like", methods=["POST"])
@jwt_required()
def like_comment_answer(
    id: str, comment_id: str, reply_id: str
) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({"message": "Comment not found"}), 404

    reply = CommentAnswer.query.filter_by(id=reply_id).first()

    if reply is None:
        return jsonify({"message": "Reply not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user in reply.likes:
        return jsonify({"message": "Reply already liked"}), 400

    reply.likes.append(user)

    if reply.user_id != user_id:
        create_notification(reply.user_id, "like", reply.id, "comment_answer", user_id)
        if reply.user.expo_push_token:
            send_push_notification(
                reply.user.expo_push_token,
                "GotStyle",
                f"{user.username} liked your reply!",
            )

    db.session.commit()

    return jsonify({"message": "Reply liked"}), 200


# POST /outfits/:id/comment/:comment_id/reply
@outfits_bp.route("/<id>/comment/<comment_id>/reply", methods=["POST"])
@jwt_required()
def reply_comment(id: str, comment_id: str) -> tuple[Response, int]:
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    outfit = Outfit.query.filter_by(id=id).first()
    comment = Comment.query.filter_by(id=comment_id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    if comment is None:
        return jsonify({"message": "Comment not found"}), 404

    data = request.get_json()

    if "text" not in data:
        return jsonify({"message": "Text is required"}), 400

    data["id"] = str(uuid.uuid4())
    data["user_id"] = get_jwt_identity()
    data["comment_id"] = comment.id
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    data["commenter_id"] = comment.user_id
    data["reply_to_username"] = comment.user.username

    comment_answer = CommentAnswer(**data)

    if comment.user_id != user_id:
        create_notification(
            comment.user_id, "reply", comment_answer.id, "comment_answer", user_id
        )
        if comment.user.expo_push_token:
            send_push_notification(
                comment.user.expo_push_token,
                "GotStyle",
                f"{user.username} replied to your comment!",
            )

    db.session.add(comment_answer)
    db.session.commit()

    return jsonify(comment_answer.to_dict()), 201


# POST /outfits/:id/comment/:comment_id/like
@outfits_bp.route("/<id>/comment/<comment_id>/like", methods=["POST"])
@jwt_required()
def like_comment(id: str, comment_id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({"message": "Comment not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user in comment.likes:
        return jsonify({"message": "Comment already liked"}), 400

    comment.likes.append(user)

    if comment.user_id != user_id:
        create_notification(comment.user_id, "like", comment.id, "comment", user_id)
        if comment.user.expo_push_token:
            send_push_notification(
                comment.user.expo_push_token,
                "GotStyle",
                f"{user.username} liked your comment!",
            )

    db.session.commit()

    return jsonify({"message": "Comment liked"}), 200


# POST /outfits/:id/comment/:comment_id/unlike
@outfits_bp.route("/<id>/comment/<comment_id>/unlike", methods=["POST"])
@jwt_required()
def unlike_comment(id: str, comment_id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    comment = Comment.query.filter_by(id=comment_id).first()

    if comment is None:
        return jsonify({"message": "Comment not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user not in comment.likes:
        return jsonify({"message": "Comment not liked"}), 400

    comment.likes.remove(user)

    db.session.commit()

    return jsonify({"message": "Comment unliked"}), 200


# POST /outfits/:id/save
@outfits_bp.route("/<id>/save", methods=["POST"])
@jwt_required()
def save_outfit(id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user in outfit.saves:
        return jsonify({"message": "Outfit already saved"}), 400

    if outfit.user_id != user_id:
        create_notification(outfit.user_id, "save", outfit.id, "outfit", user_id)
        if outfit.user.expo_push_token:
            send_push_notification(
                outfit.user.expo_push_token,
                "GotStyle",
                f"{user.username} saved your outfit!",
            )

    outfit.saves.append(user)

    db.session.commit()

    return jsonify({"message": "Outfit saved"}), 200


# POST /outfits/:id/unsave
@outfits_bp.route("/<id>/unsave", methods=["POST"])
@jwt_required()
def unsave_outfit(id: str) -> tuple[Response, int]:
    outfit = Outfit.query.filter_by(id=id).first()

    if outfit is None:
        return jsonify({"message": "Outfit not found"}), 404

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user not in outfit.saves:
        return jsonify({"message": "Outfit not saved"}), 400

    outfit.saves.remove(user)

    db.session.commit()

    return jsonify({"message": "Outfit unsaved"}), 200
