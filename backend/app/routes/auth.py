from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo
from bson import ObjectId

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "admin")  # default to admin

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = generate_password_hash(password)
    user = {
        "email": email,
        "password": hashed_pw,
        "role": role,
    }
    mongo.db.users.insert_one(user)
    return jsonify({"message": "Admin registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = mongo.db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity={"id": str(user["_id"]), "role": user["role"]})
    return jsonify({"token": token, "role": user["role"]}), 200
