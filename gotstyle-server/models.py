from datetime import datetime
from db import db

outfit_like = db.Table(
    "outfit_like",
    db.Column("outfit_id", db.String(36), db.ForeignKey("outfit.id"), primary_key=True),
    db.Column("user_id", db.String(36), db.ForeignKey("user.id"), primary_key=True),
)

outfit_save = db.Table(
    "outfit_save",
    db.Column("outfit_id", db.String(36), db.ForeignKey("outfit.id"), primary_key=True),
    db.Column("user_id", db.String(36), db.ForeignKey("user.id"), primary_key=True),
)

comment_likes = db.Table(
    "comment_like",
    db.Column("comment_id", db.String(36), db.ForeignKey("comment.id")),
    db.Column("user_id", db.String(36), db.ForeignKey("user.id")),
)

comment_reply_likes = db.Table(
    "comment_reply_like",
    db.Column("comment_answer_id", db.String(36), db.ForeignKey("comment_answer.id")),
    db.Column("user_id", db.String(36), db.ForeignKey("user.id")),
)


# User model
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.String(36), primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    outfits = db.relationship("Outfit", backref="user", lazy=True)
    comments = db.relationship("Comment", backref="user", lazy=True)
    name = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    bio = db.Column(db.String(200), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    following_rel = db.relationship(
        "Follow", foreign_keys="Follow.follower_id", backref="follower", lazy="dynamic"
    )
    followers_rel = db.relationship(
        "Follow", foreign_keys="Follow.followee_id", backref="followee", lazy="dynamic"
    )
    is_private = db.Column(db.Boolean, default=False)
    sex = db.Column(db.String(50), nullable=True)
    streak = db.Column(db.Integer, default=0)
    last_upload_time = db.Column(db.DateTime, default=datetime.utcnow)
    expo_push_token = db.Column(db.String(200), nullable=True)
    notifications = db.relationship("Notification", backref="user", lazy=True)
    verified = db.Column(db.Boolean, default=False)

    def to_dict(self):
        followers = (
            db.session.query(User)
            .join(Follow, Follow.follower_id == User.id)
            .filter(Follow.followee_id == self.id, Follow.status == "Accepted")
            .all()
        )

        followings = (
            db.session.query(User)
            .join(Follow, Follow.followee_id == User.id)
            .filter(Follow.follower_id == self.id, Follow.status == "Accepted")
            .all()
        )

        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at,
            "image_url": self.image_url,
            "bio": self.bio,
            "updated_at": self.updated_at,
            "outfits": [outfit.to_dict() for outfit in self.outfits],
            "color": self.color,
            "name": self.name,
            "sex": self.sex,
            "liked_outfits": [
                {
                    "id": outfit.id,
                    "photo_url": outfit.photo_url,
                    "shoes_url": outfit.shoes_url,
                    "video_url": outfit.video_url,
                    "user_id": outfit.user_id,
                    "created_at": outfit.created_at,
                    "user": {
                        "username": outfit.user.username,
                        "image_url": outfit.user.image_url,
                        "id": outfit.user.id,
                        "color": outfit.user.color,
                    },
                    "likes": {
                        "count": len(outfit.likes),
                        "users": [
                            {
                                "id": user.id,
                                "username": user.username,
                                "image_url": user.image_url,
                            }
                            for user in outfit.likes
                        ],
                    },
                    "saves": {
                        "count": len(outfit.saves),
                        "users": [
                            {
                                "id": user.id,
                                "username": user.username,
                                "image_url": user.image_url,
                            }
                            for user in outfit.saves
                        ],
                    },
                    "comments": [comment.to_dict() for comment in outfit.comments],
                }
                for outfit in self.liked_outfits
            ],
            "saved_outfits": [
                {
                    "id": outfit.id,
                    "photo_url": outfit.photo_url,
                    "shoes_url": outfit.shoes_url,
                    "video_url": outfit.video_url,
                    "user_id": outfit.user_id,
                    "created_at": outfit.created_at,
                    "user": {
                        "username": outfit.user.username,
                        "image_url": outfit.user.image_url,
                        "id": outfit.user.id,
                        "color": outfit.user.color,
                    },
                }
                for outfit in self.saved_outfits
            ],
            "followers": [
                {
                    "id": user.id,
                    "username": user.username,
                    "image_url": user.image_url,
                }
                for user in followers
            ],
            "following": [
                {
                    "id": user.id,
                    "username": user.username,
                    "image_url": user.image_url,
                }
                for user in followings
            ],
            "pending_follows": [
                {
                    "id": f.follower.id,
                    "status": f.status,
                }
                for f in self.followers_rel.filter(Follow.status == "Pending")
            ],
            "is_private": self.is_private,
            "streak": self.streak,
            "expo_push_token": self.expo_push_token,
            "last_upload_time": self.last_upload_time,
            "verified": self.verified,
        }


# Outfit model
class Outfit(db.Model):
    __tablename__ = "outfit"
    id = db.Column(db.String(36), primary_key=True)
    photo_url = db.Column(db.String(200), nullable=True)
    shoes_url = db.Column(db.String(200), nullable=True)
    video_url = db.Column(db.String(200), nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey("user.id"), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.relationship(
        "User", secondary="outfit_like", backref=db.backref("liked_outfits", lazy=True)
    )
    saves = db.relationship(
        "User", secondary="outfit_save", backref=db.backref("saved_outfits", lazy=True)
    )
    comments = db.relationship("Comment", backref="outfit", lazy=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    hashtags = db.relationship("OutfitHashtag", backref="outfit", lazy=True)
    style = db.Column(db.String(50), nullable=True)
    outfit_images = db.relationship("OutfitImage", backref="outfit", lazy=True)
    links = db.relationship("OutfitLink", backref="outfit", lazy=True)

    def to_dict(self):
        followers = (
            db.session.query(User)
            .join(Follow, Follow.follower_id == User.id)
            .filter(Follow.followee_id == self.user_id, Follow.status == "Accepted")
            .all()
        )

        outfit_links = OutfitLink.query.filter_by(outfit_id=self.id).all()

        outfit_images = OutfitImage.query.filter_by(outfit_id=self.id).all()

        return {
            "id": self.id,
            "photo_url": self.photo_url,
            "shoes_url": self.shoes_url,
            "video_url": self.video_url,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "likes": {
                "count": len(self.likes),
                "users": [
                    {
                        "id": user.id,
                        "username": user.username,
                        "image_url": user.image_url,
                    }
                    for user in self.likes
                ],
            },
            "saves": {
                "count": len(self.saves),
                "users": [
                    {
                        "id": user.id,
                        "username": user.username,
                        "image_url": user.image_url,
                    }
                    for user in self.saves
                ],
            },
            "comments": [comment.to_dict() for comment in self.comments],
            "updated_at": self.updated_at,
            "description": self.description,
            "user": {
                "username": self.user.username,
                "image_url": self.user.image_url,
                "id": self.user.id,
                "color": self.user.color,
                "is_private": self.user.is_private,
                "followers": [
                    {
                        "id": user.id,
                        "username": user.username,
                        "image_url": user.image_url,
                    }
                    for user in followers
                ],
            },
            "description": self.description,
            "hashtags": [hashtag.hashtag for hashtag in self.hashtags],
            "style": self.style,
            "outfit_images": [image.to_dict() for image in outfit_images],
            "links": [link.to_dict() for link in outfit_links],
        }


# Outfit Image model
class OutfitImage(db.Model):
    __tablename__ = "outfit_image"
    id = db.Column(db.String(36), primary_key=True)
    outfit_id = db.Column(
        db.String(36),
        db.ForeignKey("outfit.id"),
        nullable=False,
    )
    image_url = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "outfit_id": self.outfit_id,
            "image_url": self.image_url,
        }


class OutfitLink(db.Model):
    __tablename__ = "outfit_link"
    id = db.Column(db.String(36), primary_key=True)
    outfit_id = db.Column(
        db.String(36),
        db.ForeignKey("outfit.id"),
        nullable=False,
    )
    link = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "outfit_id": self.outfit_id,
            "link": self.link,
            "description": self.description,
        }


# Outfit Poll model
class OutfitPoll(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    outfit_id = db.Column(
        db.String(36),
        db.ForeignKey("outfit.id"),
        nullable=False,
    )
    question = db.Column(db.String(200), nullable=False)
    options = db.relationship("PollOption", backref="poll", lazy=True)
    expires_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "outfit_id": self.outfit_id,
            "question": self.question,
            "options": [option.to_dict() for option in self.options],
            "expires_at": self.expires_at,
        }


class PollOption(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    poll_id = db.Column(
        db.String(36),
        db.ForeignKey("outfit_poll.id"),
        nullable=False,
    )
    option = db.Column(db.String(200), nullable=False)
    votes = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "poll_id": self.poll_id,
            "option": self.option,
            "votes": self.votes,
        }


class OutfitHashtag(db.Model):
    __tablename__ = "outfit_hashtag"
    id = db.Column(db.String(36), primary_key=True)
    outfit_id = db.Column(
        db.String(36),
        db.ForeignKey("outfit.id"),
        nullable=False,
    )
    hashtag = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {"id": self.id, "outfit_id": self.outfit_id, "hashtag": self.hashtag}


# Comment model
class Comment(db.Model):
    __tablename__ = "comment"
    id = db.Column(db.String(36), primary_key=True)
    text = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey("user.id"), nullable=False)
    outfit_id = db.Column(db.String(36), db.ForeignKey("outfit.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.relationship(
        "User",
        secondary="comment_like",
        backref=db.backref("liked_comments", lazy=True),
    )
    answers = db.relationship("CommentAnswer", backref="comment", lazy=True)

    def to_dict(self):
        replies = CommentAnswer.query.filter_by(comment_id=self.id).all()

        return {
            "id": self.id,
            "text": self.text,
            "user_id": self.user_id,
            "outfit_id": self.outfit_id,
            "created_at": self.created_at,
            "likes": [
                {
                    "id": user.id,
                    "username": user.username,
                    "image_url": user.image_url,
                }
                for user in self.likes
            ],
            "user": {
                "username": self.user.username,
                "image_url": self.user.image_url,
                "id": self.user.id,
                "name": self.user.name,
            },
            "answers": [answer.to_dict() for answer in replies] if replies else [],
        }


# Comment Answer model
class CommentAnswer(db.Model):
    __tablename__ = "comment_answer"
    id = db.Column(db.String(36), primary_key=True)
    text = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey("user.id"), nullable=False)
    comment_id = db.Column(db.String(36), db.ForeignKey("comment.id"), nullable=False)
    commenter_id = db.Column(db.String(36), nullable=False)
    reply_to_username = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.relationship(
        "User",
        secondary="comment_reply_like",
        backref=db.backref("liked_comment_replies", lazy=True),
    )

    def to_dict(self):
        commenter = User.query.get(self.commenter_id)
        user = User.query.get(self.user_id)
        reply_to_user = User.query.filter_by(username=self.reply_to_username).first()

        return {
            "id": self.id,
            "text": self.text,
            "user_id": self.user_id,
            "comment_id": self.comment_id,
            "created_at": self.created_at,
            "reply_to_username": self.reply_to_username,
            "user": {
                "username": user.username,
                "image_url": user.image_url,
                "id": user.id,
                "name": user.name,
            },
            "commenter": {
                "username": commenter.username,
                "image_url": commenter.image_url,
                "id": commenter.id,
                "name": commenter.name,
            },
            "likes": [
                {
                    "id": like.id,
                    "username": like.username,
                    "image_url": like.image_url,
                }
                for like in self.likes
            ],
            "reply_to_user": {
                "username": reply_to_user.username,
                "image_url": reply_to_user.image_url,
                "id": reply_to_user.id,
                "name": reply_to_user.name,
            },
        }


# Notification model
class Notification(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("user.id"), nullable=False)
    sender_id = db.Column(db.String(36), nullable=False)
    action_type = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.String(36), nullable=False)
    entity_type = db.Column(db.String(50), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        entity = None
        if self.entity_type == "outfit":
            entity = Outfit.query.get(self.entity_id)
        elif self.entity_type == "comment":
            entity = Comment.query.get(self.entity_id)
        elif self.entity_type == "comment_answer":
            entity = CommentAnswer.query.get(self.entity_id)

        sender = User.query.get(self.sender_id)

        return {
            "id": self.id,
            "user_id": self.user_id,
            "action_type": self.action_type,
            "entity_id": self.entity_id,
            "entity_type": self.entity_type,
            "is_read": self.is_read,
            "created_at": self.created_at,
            "user": {
                "username": self.user.username,
                "image_url": self.user.image_url,
                "id": self.user.id,
                "name": self.user.name,
            },
            "entity": entity.to_dict() if entity else None,
            "sender": {
                "username": sender.username,
                "image_url": sender.image_url,
                "id": sender.id,
                "name": sender.name,
            },
        }


# Follow model
class Follow(db.Model):
    __tablename__ = "follow"
    id = db.Column(db.String(36), primary_key=True)
    follower_id = db.Column(db.String(36), db.ForeignKey("user.id"))
    followee_id = db.Column(db.String(36), db.ForeignKey("user.id"))
    status = db.Column(db.String(50), default="Pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "follower_id": self.follower_id,
            "followee_id": self.followee_id,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


# Token Blocklist model
class TokenBlockList(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)
