from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    create_refresh_token,
    get_jwt,
)
from models import User, TokenBlockList, Follow, Notification
from db import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, time
from util import check_email, get_dark_color, send_push_notification
from flask.wrappers import Response
from core.s3 import upload_to_s3
from core.search import search_users
from sqlalchemy import desc
from dotenv import load_dotenv
import uuid
import requests
import os

load_dotenv()

users_bp = Blueprint("users", __name__, url_prefix="/users")


# GET /users
@users_bp.route("/", methods=["GET"])
@jwt_required()
def get_users() -> tuple[Response, int]:
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


# GET /users/available-username
@users_bp.route("/available-username", methods=["GET"])
def get_available_username() -> tuple[Response, int]:
    username = request.args.get("username")
    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"message": "Username is available", "exists": False}), 200

    return jsonify({"message": "Username is not available", "exists": True}), 200


# GET /users/:id/following/outfits
@users_bp.route("/<id>/following/outfits", methods=["GET"])
@jwt_required()
def get_following_outfits_by_id(id: str):
    user = User.query.filter_by(id=id).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    following = user.following

    outfits = []

    for follow in following:
        outfits.extend(follow.outfits)

    return jsonify([outfit.to_dict() for outfit in outfits]), 200


# GET /users/available-email
@users_bp.route("/available-email", methods=["GET"])
def get_available_email() -> tuple[Response, int]:
    email = request.args.get("email")
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"message": "Email is available", "exists": False}), 200

    return jsonify({"message": "Email is not available", "exists": True}), 200


# GET /users/unread-notifications
@users_bp.route("/unread-notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    user = User.query.filter_by(id=get_jwt_identity()).first()
    notifications = (
        Notification.query.filter_by(user_id=user.id, is_read=False)
        .order_by(desc(Notification.created_at))
        .all()
    )

    return (
        jsonify(
            [notification.to_dict() for notification in notifications]
            if notifications
            else []
        ),
        200,
    )


# GET /users/read-notifications
@users_bp.route("/read-notifications", methods=["GET"])
@jwt_required()
def get_read_notifications():
    user = User.query.filter_by(id=get_jwt_identity()).first()
    notifications = (
        Notification.query.filter_by(user_id=user.id, is_read=True)
        .order_by(desc(Notification.created_at))
        .all()
    )

    return (
        jsonify(
            [notification.to_dict() for notification in notifications]
            if notifications
            else []
        ),
        200,
    )


# GET /users/closest-users
@users_bp.route("/closest-users", methods=["GET"])
@jwt_required()
def get_closest_users() -> tuple[Response, int]:
    current_user_id = get_jwt_identity()
    current_user = User.query.filter_by(id=current_user_id).first()

    if current_user is None:
        return jsonify({"message": "User not found"}), 404

    all_users = User.query.all()

    if all_users is None:
        return jsonify({"message": "No users found"}), 404

    closest_users = []
    for user in all_users:
        if user.id == current_user_id:
            continue

        is_following = (
            db.session.query(Follow)
            .filter_by(
                follower_id=current_user_id, followee_id=user.id, status="Accepted"
            )
            .first()
        )
        is_followed = (
            db.session.query(Follow)
            .filter_by(
                followee_id=current_user_id, follower_id=user.id, status="Accepted"
            )
            .first()
        )

        score = 0
        if is_following and is_followed:
            score = 2
        elif is_following or is_followed:
            score = 1

        closest_users.append((user, score))

    closest_users.sort(key=lambda x: x[1], reverse=True)
    closest_users_json = [
        {"user": user.to_dict(), "score": score} for user, score in closest_users
    ]

    return jsonify(closest_users_json), 200


# GET /users/me
@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_user() -> tuple[Response, int]:
    query = User.query.filter_by(id=get_jwt_identity())
    user = query.first()
    has_posted_today = False
    user_likes = 0
    outfits = user.outfits

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if len(outfits) == 0:
        has_posted_today = False
    else:
        last_outfit = outfits[-1]

        time_since_last_post = datetime.now() - last_outfit.created_at

        if time_since_last_post > timedelta(hours=36):
            user.streak = 0

        if last_outfit.created_at.date() == datetime.now().date():
            has_posted_today = True

    sorted_outfits = sorted(outfits, key=lambda outfit: outfit.created_at, reverse=True)
    user.outfits = sorted_outfits

    for outfit in outfits:
        user_likes += len(outfit.likes)

    user_dict = user.to_dict()
    extended_user_data = {
        **user_dict,
        "likes": user_likes,
        "has_posted_today": has_posted_today,
    }

    return jsonify(extended_user_data), 200


# GET /users/:id
@users_bp.route("/<id>", methods=["GET"])
@jwt_required()
def get_user_by_id(id: str) -> tuple[Response, int]:
    user = User.query.filter_by(id=id).first()
    has_posted_today = False
    user_likes = 0
    outfits = user.outfits

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if len(outfits) == 0:
        has_posted_today = False
    else:
        last_outfit = outfits[-1]

        time_since_last_post = datetime.now() - last_outfit.created_at

        if time_since_last_post > timedelta(hours=36):
            user.streak = 0

        if last_outfit.created_at.date() == datetime.now().date():
            has_posted_today = True

    sorted_outfits = sorted(outfits, key=lambda outfit: outfit.created_at, reverse=True)
    user.outfits = sorted_outfits

    for outfit in outfits:
        user_likes += len(outfit.likes)

    user_dict = user.to_dict()
    extended_user_data = {
        **user_dict,
        "likes": user_likes,
        "has_posted_today": has_posted_today,
    }

    return jsonify(extended_user_data), 200


# GET /users/following-outfits
@users_bp.route("/following-outfits", methods=["GET"])
@jwt_required()
def get_following_outfits():
    query = User.query.filter_by(id=get_jwt_identity())
    user = query.first()
    following = user.following

    outfits = []

    for follow in following:
        outfits.extend(follow.outfits)

    if user is None:
        return jsonify({"message": "User not found"}), 404

    return jsonify([outfit.to_dict() for outfit in outfits]), 200


# GET /users/search/:query
@users_bp.route("/search/<query>", methods=["GET"])
@jwt_required()
def search_users_route(query: str) -> tuple[Response, int]:
    users = User.query.all()

    if users is None:
        return jsonify({"message": "No users found"}), 404

    result = search_users([user.to_dict() for user in users], query)

    if len(result) == 0:
        return jsonify({"message": "No users found"}), 200

    return jsonify(result), 200


# GET /users/has-posted-today
@users_bp.route("/has-posted-today", methods=["GET"])
@jwt_required()
def has_posted_today() -> tuple[Response, int]:
    user = User.query.filter_by(id=get_jwt_identity()).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    outfits = user.outfits

    if len(outfits) == 0:
        return jsonify({"has_posted_today": False}), 200

    last_outfit = outfits[-1]

    now = datetime.now()

    today_9am = datetime.combine(now.date(), time(9, 0))

    if (
        last_outfit.created_at.date() == now.date()
        and last_outfit.created_at >= today_9am
    ):
        return jsonify({"has_posted_today": True}), 200

    return jsonify({"has_posted_today": False}), 200


# PUT /users/me/expo-push-token
@users_bp.route("/me/expo-push-token", methods=["PUT"])
@jwt_required()
def update_expo_push_token() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["expo_push_token"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    user.expo_push_token = data["expo_push_token"]

    db.session.commit()

    return jsonify({"message": "User updated successfully"}), 200


# POST /users/me/read-notifications
@users_bp.route("/me/read-notifications", methods=["POST"])
@jwt_required()
def read_notifications() -> tuple[Response, int]:
    user = User.query.filter_by(id=get_jwt_identity()).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    notifications = Notification.query.filter_by(user_id=user.id, is_read=False).all()

    for notification in notifications:
        notification.is_read = True

    db.session.commit()

    return jsonify({"message": "Notifications read successfully"}), 200


# PUT /users/me/read-notification
@users_bp.route("/me/read-notification", methods=["PUT"])
@jwt_required()
def read_notification() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["notification_id"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()
    notification = Notification.query.filter_by(id=data["notification_id"]).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if notification is None:
        return jsonify({"message": "Notification not found"}), 404

    notification.is_read = True

    db.session.commit()

    return jsonify({"message": "Notification read successfully"}), 200


# PUT /users/me/basic-settings
@users_bp.route("/me/basic-settings", methods=["PUT"])
@jwt_required()
def update_basic_settings() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["photo_base64", "bio", "name", "is_private"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if data["photo_base64"]:
        user.image_url = upload_to_s3(data["photo_base64"], user.id, "profile_picture")

    user.bio = data["bio"]
    user.name = data["name"]
    user.is_private = data["is_private"]

    db.session.commit()

    return jsonify({"message": "User updated successfully"}), 200


# PUT /users/me
@users_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_user() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["username", "email", "photo_base64", "bio", "sex", "name", "is_private"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

        if isinstance(data[field], str):
            data[field] = data[field].strip()

    if not check_email(data["email"]):
        return jsonify({"message": "Invalid email"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if data["photo_base64"]:
        user.image_url = upload_to_s3(data["photo_base64"], user.id, "profile_picture")

        data.pop("photo_base64")

    data["updated_at"] = datetime.now()

    for key, value in data.items():
        setattr(user, key, value)

    db.session.commit()

    return jsonify(user.to_dict()), 200


# PUT /users/follow
@users_bp.route("/follow", methods=["PUT"])
@jwt_required()
def follow_user() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["user_id"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()
    user_to_follow = User.query.filter_by(id=data["user_id"]).first()

    if user is None or user_to_follow is None:
        return jsonify({"message": "User not found"}), 404

    if user.id == user_to_follow.id:
        return jsonify({"message": "You cannot follow yourself"}), 400

    existing_follow = Follow.query.filter_by(
        follower_id=user.id, followee_id=user_to_follow.id
    ).first()
    if existing_follow:
        return (
            jsonify(
                {
                    "message": "You are already following or have sent a request to this user"
                }
            ),
            400,
        )

    status = "Accepted"

    new_follow = Follow(
        id=str(uuid.uuid4()),
        follower_id=user.id,
        followee_id=user_to_follow.id,
        status=status,
    )
    db.session.add(new_follow)

    new_notification = Notification(
        id=str(uuid.uuid4()),
        user_id=user_to_follow.id,
        action_type="Follow",
        entity_id=user.id,
        sender_id=user.id,
        entity_type="User",
    )
    send_push_notification(
        user_to_follow.expo_push_token,
        "New follower",
        f"{user.username} is now following you!",
    )

    db.session.add(new_notification)

    db.session.commit()

    return (
        jsonify(
            {
                "message": f"Successfully sent follow request to {user_to_follow.username}",
                "status": status,
            }
        ),
        201,
    )


# PUT /users/accept-follow
@users_bp.route("/accept-follow", methods=["PUT"])
@jwt_required()
def accept_follow() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["follower_id"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()
    follower = User.query.filter_by(id=data["follower_id"]).first()

    if user is None or follower is None:
        return jsonify({"message": "User not found"}), 404

    if user.id == follower.id:
        return jsonify({"message": "Invalid operation"}), 400

    existing_follow = Follow.query.filter_by(
        follower_id=follower.id, followee_id=user.id
    ).first()

    if not existing_follow:
        return jsonify({"message": "No follow request found"}), 404

    if existing_follow.status == "Accepted":
        return jsonify({"message": "You are already following this user"}), 400

    existing_follow.status = "Accepted"

    new_notification = Notification(
        id=str(uuid.uuid4()),
        sender_id=user.id,
        user_id=follower.id,
        action_type="Follow_Accepted",
        entity_id=user.id,
        entity_type="Follow",
    )
    send_push_notification(
        follower.expo_push_token,
        "Follow request accepted",
        f"{user.username} has accepted your follow request!",
    )

    notification_to_delete = Notification.query.filter_by(
        user_id=user.id,
        sender_id=follower.id,
        action_type="Follow_Request",
        entity_id=user.id,
        entity_type="Follow",
    ).first()

    if notification_to_delete:
        db.session.delete(notification_to_delete)

    db.session.add(new_notification)

    db.session.commit()

    return (
        jsonify(
            {
                "message": f"Successfully accepted the follow request from {follower.username}"
            }
        ),
        200,
    )


# PUT /users/reject-follow
@users_bp.route("/reject_follow", methods=["PUT"])
@jwt_required()
def reject_follow_request() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["user_id"]
    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    current_user_id = get_jwt_identity()
    user_to_unfollow_id = data["user_id"]

    if current_user_id == user_to_unfollow_id:
        return jsonify({"message": "You cannot reject yourself"}), 400

    follow_entry = Follow.query.filter_by(
        follower_id=user_to_unfollow_id, followee_id=current_user_id, status="Pending"
    ).first()

    if follow_entry is None:
        return jsonify({"message": "No pending request from this user"}), 404

    db.session.delete(follow_entry)

    notification_to_delete = Notification.query.filter_by(
        user_id=user_to_unfollow_id,
        sender_id=current_user_id,
        action_type="Follow_Request",
        entity_id=current_user_id,
        entity_type="User",
    ).first()

    if notification_to_delete:
        db.session.delete(notification_to_delete)

    db.session.commit()

    return jsonify({"message": "Successfully rejected the follow request"}), 200


# PUT /users/unfollow
@users_bp.route("/unfollow", methods=["PUT"])
@jwt_required()
def unfollow_user() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["user_id"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()
    user_to_unfollow = User.query.filter_by(id=data["user_id"]).first()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if user_to_unfollow is None:
        return jsonify({"message": "User to unfollow not found"}), 404

    if user.id == user_to_unfollow.id:
        return jsonify({"message": "You cannot unfollow yourself"}), 400

    follow_to_delete = Follow.query.filter_by(
        follower_id=user.id, followee_id=user_to_unfollow.id
    ).first()

    if follow_to_delete is None:
        return jsonify({"message": "You are not following this user"}), 400

    notification_to_delete = Notification.query.filter_by(
        user_id=user_to_unfollow.id,
        sender_id=user.id,
        action_type="Follow",
        entity_id=user.id,
        entity_type="User",
    ).first()

    if notification_to_delete:
        db.session.delete(notification_to_delete)

    db.session.delete(follow_to_delete)

    db.session.commit()

    return (
        jsonify(
            {
                "message": "Successfully unfollowed user",
                "user": user_to_unfollow.to_dict(),
            }
        ),
        201,
    )


""" AUTHENTICATION """


# POST /auth/signup
@users_bp.route("/auth/signup", methods=["POST"])
def signup() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["username", "email", "password", "confirm_password"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    if not check_email(data["email"]):
        return jsonify({"message": "Invalid email"}), 401

    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user is not None:
        return jsonify({"message": "Email is taken"}), 401

    username_user = User.query.filter_by(username=data["username"]).first()

    if username_user is not None:
        return jsonify({"message": "Username is taken"}), 401

    if data["password"] != data["confirm_password"]:
        return jsonify({"message": "Passwords do not match"}), 401

    data["id"] = str(uuid.uuid4())
    data["password"] = generate_password_hash(data["password"])
    data["created_at"] = datetime.now()
    data["updated_at"] = datetime.now()
    data["color"] = get_dark_color()
    data["email"] = data["email"].lower().strip()
    data["username"] = data["username"].strip()

    data.pop("confirm_password")

    user = User(**data)

    db.session.add(user)
    db.session.commit()

    access_token, refresh_token = create_access_token(
        identity=user.id, fresh=True
    ), create_refresh_token(identity=user.id)
    expires_in = timedelta(minutes=60)
    expires_at = datetime.now() + expires_in

    return (
        jsonify(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "expires": int(expires_at.timestamp()),
                "id": user.id,
            }
        ),
        201,
    )


# GET /auth/google/callback
@users_bp.route("/auth/google/callback", methods=["GET"])
def google_callback() -> tuple[Response, int]:
    auth_code = request.args.get("code")

    clientId = os.getenv("GOOGLE_CLIENT_ID")
    clientSecret = os.getenv("GOOGLE_CLIENT_SECRET")

    url = f"https://oauth2.googleapis.com/token?code=${auth_code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=http://localhost:3001/google&grant_type=authorization_code"

    response = requests.post(url)
    print(response.json())

    return jsonify({"message": "Google callback"}), 200


# POST /auth/login
@users_bp.route("/auth/login", methods=["POST"])
def login() -> tuple[Response, int]:
    data = request.get_json()

    fields = ["credential", "password"]

    for field in fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    user = User.query.filter(
        (User.email == data["credential"].strip())
        | (User.username == data["credential"].strip())
    ).first()

    if user is None:
        return jsonify({"message": "This email or username doesn't exist"}), 401

    if not check_password_hash(user.password, data["password"]) or not user:
        return jsonify({"message": "Invalid credentials"}), 401

    access_token, refresh_token = create_access_token(
        identity=user.id, fresh=True
    ), create_refresh_token(identity=user.id)
    expires_in = timedelta(minutes=60)
    expires_at = datetime.now() + expires_in

    return (
        jsonify(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "expires": int(expires_at.timestamp()),
                "id": user.id,
            }
        ),
        201,
    )


# POST /auth/refresh-token
@users_bp.route("/auth/refresh-token", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token() -> tuple[Response, int]:
    current_user = User.query.filter_by(id=get_jwt_identity()).first()

    if current_user is None:
        return jsonify({"message": "User not found", "valid": False}), 404

    access_token = create_access_token(identity=get_jwt_identity(), fresh=False)
    expires_in = timedelta(minutes=60)
    expires_at = datetime.now() + expires_in

    return (
        jsonify(
            {
                "access_token": access_token,
                "expires": int(expires_at.timestamp()),
                "valid": True,
            }
        ),
        200,
    )


# POST /auth/logout
@users_bp.route("/auth/logout", methods=["POST"])
@jwt_required()
def logout() -> tuple[Response, int]:
    jti = get_jwt()["jti"]
    token = TokenBlockList(jti=jti, created_at=datetime.now())
    db.session.add(token)
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200
