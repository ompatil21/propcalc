from flask import Blueprint, request, jsonify
from app.db import db  # Make sure your db connection is here

user_bp = Blueprint("user", __name__, url_prefix="/api/user")


@user_bp.route("/update", methods=["PUT"])
def update_user():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        update_fields = {}

        if "name" in data:
            update_fields["name"] = data["name"]
        if "address" in data:
            update_fields["address"] = data["address"]

        result = db.users.update_one({"email": email}, {"$set": update_fields})

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        updated_user = db.users.find_one({"email": email})
        return (
            jsonify(
                {
                    "message": "User updated successfully",
                    "user": {
                        "name": updated_user.get("name"),
                        "email": updated_user.get("email"),
                        "address": updated_user.get("address", ""),
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
