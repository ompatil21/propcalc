import os
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv  # to load .env file


# Load environment variables
load_dotenv()

mongo = PyMongo()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    from app.routes.properties import bp as properties_bp

    app.register_blueprint(properties_bp)

    # Load config from .env
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB_NAME", "investment_property_db")
    app.config["MONGO_URI"] = f"{mongo_uri}/{db_name}"
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret")

    mongo.init_app(app)
    jwt.init_app(app)

    #  Allow frontend requests
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Register routes
    from app.routes.admin import bp as admin_bp
    from app.routes.auth import auth_bp

    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)

    return app
