from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import db
from app.models.property import property_serializer
from app.services.admin_dashboard import (
    get_summary_data,
    get_property_type_distribution,
    get_owner_distribution,
    get_monthly_addition_stats,
)
from app.services.admin_user import get_all_users, create_user, update_user, delete_user

import logging
from bson import ObjectId

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


# Admin-only check
def is_admin():
    user = get_jwt_identity()
    return user.get("role") == "admin"


@bp.route("/properties", methods=["GET"])
@jwt_required()
def get_all_properties():
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        total = db.properties.count_documents({})
        properties = list(db.properties.find().skip(skip).limit(limit))

        return (
            jsonify(
                {
                    "total": total,
                    "page": page,
                    "limit": limit,
                    "properties": [property_serializer(p) for p in properties],
                }
            ),
            200,
        )
    except Exception as e:
        logger.error(f"Error in pagination: {e}")
        return jsonify({"error": "Pagination failed", "details": str(e)}), 500


@bp.route("/analytics/summary", methods=["GET"])
@jwt_required()
def analytics_summary():
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        data = get_summary_data()
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error fetching summary analytics: {e}")
        return jsonify({"error": "Failed to fetch summary", "details": str(e)}), 500


@bp.route("/analytics/property-type-distribution", methods=["GET"])
@jwt_required()
def analytics_property_type_distribution():
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        data = get_property_type_distribution()
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error fetching property type distribution: {e}")
        return (
            jsonify({"error": "Failed to fetch distribution", "details": str(e)}),
            500,
        )


@bp.route("/analytics/owners", methods=["GET"])
@jwt_required()
def analytics_owner_distribution():
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        data = get_owner_distribution()
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error fetching owner analytics: {e}")
        return jsonify({"error": "Owner analytics failed", "details": str(e)}), 500


@bp.route("/analytics/monthly-additions", methods=["GET"])
@jwt_required()
def analytics_monthly_additions():
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        data = get_monthly_addition_stats()
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error fetching monthly additions: {e}")
        return jsonify({"error": "Monthly additions failed", "details": str(e)}), 500


@bp.route("/users", methods=["GET"])
@jwt_required()
def get_all_users_route():
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        data = get_all_users()
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return jsonify({"error": "User fetch failed", "details": str(e)}), 500


@bp.route("/users", methods=["POST"])
@jwt_required()
def create_user_route():
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        data = request.get_json()
        user_id = create_user(data)
        return jsonify({"message": "User created", "id": user_id}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 409
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return jsonify({"error": "User creation failed", "details": str(e)}), 500


@bp.route("/users/<user_id>", methods=["PUT"])
@jwt_required()
def update_user_route(user_id):
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        data = request.get_json()
        success = update_user(user_id, data)
        if success:
            return jsonify({"message": "User updated"}), 200
        else:
            return jsonify({"error": "User not found or no change made"}), 404
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        return jsonify({"error": "User update failed", "details": str(e)}), 500


@bp.route("/users/<user_id>", methods=["DELETE"])
@jwt_required()
def delete_user_route(user_id):
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        success = delete_user(user_id)
        if success:
            return jsonify({"message": "User deleted"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        return jsonify({"error": "User deletion failed", "details": str(e)}), 500


@bp.route("/users/<user_id>", methods=["PATCH"])
@jwt_required()
def toggle_user_status(user_id):
    data = request.get_json()
    active = data.get("active")

    if active is None:
        return jsonify({"error": "Missing 'active' status"}), 400

    result = db.users.update_one(
        {"_id": ObjectId(user_id)}, {"$set": {"active": active}}
    )
    if result.modified_count == 1:
        return jsonify({"message": "User updated"}), 200
    else:
        return jsonify({"error": "User not found or no change"}), 404
