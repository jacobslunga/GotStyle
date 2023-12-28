from models import TokenBlockList
from flask_jwt_extended import JWTManager
from db import db

jwt = JWTManager()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(_, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlockList.id).filter_by(jti=jti).scalar()

    return token is not None
