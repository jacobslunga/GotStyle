from flask import Flask
from flask_jwt import jwt
from db import db
from flask_cors import CORS
from db_config import DATABASE_URI
from controllers.users import users_bp
from controllers.outfits import outfits_bp
from dotenv import load_dotenv
from datetime import timedelta
from flask_migrate import Migrate

import os


load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=60)
    app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024

    app.register_blueprint(users_bp)
    app.register_blueprint(outfits_bp)

    jwt.init_app(app)
    db.init_app(app)

    Migrate(app, db)

    return app


app = create_app()
