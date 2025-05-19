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


from flask import Blueprint, request, jsonify, session, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from flask_login import logout_user
from datetime import timedelta
from bson import ObjectId
from app import mongo
from flask_dance.contrib.google import make_google_blueprint, google

# Google OAuth Blueprint
google_bp = make_google_blueprint(
    client_id="633491235042-ueue6v248c0had83et1tecrpnqhsm6ou.apps.googleusercontent.com",
    client_secret="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",
    redirect_url="/api/auth/google/callback",
    scope=["profile", "email"],
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# Register endpoint
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")
    role = data.get("role", "tenant")

    if not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 409

    hashed_pw = generate_password_hash(password)
    user = {
        "email": email,
        "password_hash" if name else "password": hashed_pw,
        "role": role,
    }
    if name:
        user["name"] = name

    mongo.db.users.insert_one(user)

    if role == "admin":
        token = create_access_token(identity={"id": str(user.get("_id")), "role": role})
        return (
            jsonify({"message": "Admin registered successfully", "token": token}),
            201,
        )
    else:
        access_token = create_access_token(
            identity={"email": email, "role": role}, expires_delta=timedelta(hours=1)
        )
        refresh_token = create_refresh_token(
            identity={"email": email, "role": role}, expires_delta=timedelta(days=30)
        )
        return (
            jsonify(
                {
                    "message": "User registered successfully",
                    "user": {"name": name, "email": email, "role": role},
                    "tokens": {"access": access_token, "refresh": refresh_token},
                }
            ),
            201,
        )


# Login endpoint
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Missing fields"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    password_field = "password_hash" if "password_hash" in user else "password"
    if not check_password_hash(user[password_field], password):
        return jsonify({"message": "Invalid credentials"}), 401

    if user["role"] == "admin":
        token = create_access_token(
            identity={"id": str(user["_id"]), "role": user["role"]}
        )
        return jsonify({"token": token, "role": user["role"]}), 200
    else:
        access_token = create_access_token(
            identity={"email": user["email"], "role": user["role"]},
            expires_delta=timedelta(hours=1),
        )
        refresh_token = create_refresh_token(
            identity={"email": user["email"], "role": user["role"]},
            expires_delta=timedelta(days=30),
        )
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": {
                        "name": user.get("name", ""),
                        "email": user["email"],
                        "role": user["role"],
                    },
                    "tokens": {"access": access_token, "refresh": refresh_token},
                }
            ),
            200,
        )


# Get current user
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    identity = get_jwt_identity()
    user = mongo.db.users.find_one({"email": identity.get("email")})

    if not user:
        return jsonify({"message": "User not found"}), 404

    return (
        jsonify(
            {
                "user": {
                    "name": user.get("name", ""),
                    "email": user["email"],
                    "role": user["role"],
                }
            }
        ),
        200,
    )


# Refresh token
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_token = create_access_token(identity=identity, expires_delta=timedelta(hours=1))
    return jsonify({"access": new_token}), 200


# Logout (session clear for web + API)
@auth_bp.route("/logout")
def logout():
    session.clear()
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("main.index"))


@auth_bp.route("/api/logout", methods=["POST"])
def api_logout():
    return jsonify({"message": "Logged out successfully"}), 200


# Google OAuth callback
@auth_bp.route("/google/callback")
def google_callback():
    if not google.authorized:
        return redirect(url_for("google.login"))

    resp = google.get("/oauth2/v1/userinfo")
    if not resp.ok:
        return jsonify({"message": "Failed to fetch user info from Google"}), 500

    profile = resp.json()
    return jsonify(profile)
