from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import db
from app.models.property import property_serializer
from datetime import datetime
from bson.objectid import ObjectId
from cerberus import Validator

bp = Blueprint("properties", __name__, url_prefix="/api/properties")

# Validation Schema
schema = {
    "title": {"type": "string", "required": True},
    "location": {"type": "string", "required": True},
    "type": {"type": "string", "required": True},
    "state": {"type": "string", "required": True},
    "purchase_price": {"type": "number", "required": True},
    "deposit": {"type": "number", "required": True},
    "loan_amount": {"type": "number", "required": False},
    "interest_rate": {"type": "number", "required": False},
    "loan_term": {"type": "integer", "required": False},
    "lvr": {"type": "number", "required": False},
    "lmiRequired": {"type": "boolean", "required": False},
    "rent": {"type": "number", "required": False},
    "rentPerWeek": {"type": "number", "required": False},
    "weeksRented": {"type": "integer", "required": False},
    "vacancy_rate": {"type": "number", "required": False},
    "council_rates": {"type": "number", "required": False},
    "insurance": {"type": "number", "required": False},
    "maintenance": {"type": "number", "required": False},
    "property_manager": {"type": "number", "required": False},
    "wage_growth": {"type": "number", "required": False},
    "stamp_duty": {"type": "number", "required": False},
    "gst": {"type": "number", "required": False},
    "legal_fees": {"type": "number", "required": False},
    "disbursements": {"type": "number", "required": False},
    "building_inspection": {"type": "number", "required": False},
    "registration_title": {"type": "number", "required": False},
    "mortgage_stamp_duty": {"type": "number", "required": False},
    "mortgage_insurance_1": {"type": "number", "required": False},
    "stamp_duty_mi_1": {"type": "number", "required": False},
    "mortgage_insurance_2": {"type": "number", "required": False},
    "stamp_duty_mi_2": {"type": "number", "required": False},
    "loan_app_fee": {"type": "number", "required": False},
    "valuation_fee": {"type": "number", "required": False},
    "search_fees": {"type": "number", "required": False},
    "registration_mortgage": {"type": "number", "required": False},
    "date_of_purchase": {"type": "string", "required": True},
    "date_of_construction": {"type": "string", "required": True},
    "date_of_sale": {"type": "string", "required": False, "nullable": True},
    "rental_growth": {"type": "number", "required": False},
    "capital_growth_rate": {"type": "number", "required": False},
    "buildings_value": {"type": "number", "required": False},
    "fittings_value": {"type": "number", "required": False},
    "inflation": {"type": "number", "required": False},
    "preferred_lvr": {"type": "number", "required": False},
    "medicare_surcharge": {"type": "boolean", "required": False},
    "bookkeeping": {"type": "number", "required": False, "default": 0},
    "holding_years": {"type": "integer", "required": False, "default": 10},
    "once_off_expenses": {"type": "number", "required": False, "default": 0},
    "pest_control": {"type": "number", "required": False, "default": 0},
    "postage": {"type": "number", "required": False, "default": 0},
    "tax_related_expenses": {"type": "number", "required": False, "default": 0},
    "travel": {"type": "number", "required": False, "default": 0},
    "cleaning": {"type": "number", "required": False, "default": 0},
    "gardening": {"type": "number", "required": False, "default": 0},
    "land_tax": {"type": "number", "required": False, "default": 0},
    "legal_expenses": {"type": "number", "required": False, "default": 0},
    "strata": {"type": "number", "required": False, "default": 0},
    "water": {"type": "number", "required": False, "default": 0},
    "owners": {
        "type": "list",
        "required": True,
        "schema": {
            "type": "dict",
            "schema": {
                "name": {"type": "string", "required": True},
                "ownership": {"type": "number", "required": True},
                "income": {"type": "number", "required": True},
            },
        },
    },
    "email": {"type": "string", "required": True},
}


# POST: Create Property
@bp.route("", methods=["POST", "OPTIONS"])
@jwt_required()
def create_property():
    if request.method == "OPTIONS":
        return "", 200

    user = get_jwt_identity()

    try:
        data = request.get_json()
        v = Validator(schema)

        if not v.validate(data):
            return jsonify({"error": "Validation failed", "details": v.errors}), 400

        total_ownership = sum(owner.get("ownership", 0) for owner in data["owners"])
        if total_ownership != 100:
            return (
                jsonify(
                    {"error": f"Ownership must total 100%. Found {total_ownership}%"}
                ),
                400,
            )

        parsed = {**data, "user_id": user.get("_id"), "createdAt": datetime.utcnow()}

        result = db.properties.insert_one(parsed)

        if not result.inserted_id:
            return jsonify({"error": "Insert failed"}), 500

        new_doc = db.properties.find_one({"_id": result.inserted_id})
        return jsonify(property_serializer(new_doc)), 201

    except Exception as e:
        print("❌ Error inserting property:", e)
        return jsonify({"error": str(e)}), 500


# GET: All Properties by Email
@bp.route("", methods=["GET"])
def get_properties():
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"error": "Missing email"}), 400
        properties = db.properties.find({"email": email})
        return jsonify([property_serializer(p) for p in properties]), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch properties: {str(e)}"}), 500


# GET: Authenticated User's Properties
@bp.route("/user", methods=["GET"])
@jwt_required()
def get_user_properties():
    user = get_jwt_identity()
    if not user or not user.get("email"):
        return jsonify({"error": "Unauthorized"}), 401

    properties = db.properties.find({"email": user["email"]})
    return jsonify([property_serializer(p) for p in properties]), 200


# GET: Property by ID
@bp.route("/<property_id>", methods=["GET"])
@jwt_required()
def get_property_by_id(property_id):
    try:
        property = db.properties.find_one({"_id": ObjectId(property_id)})
        if not property:
            return jsonify({"error": "Property not found"}), 404
        return jsonify(property_serializer(property)), 200
    except Exception as e:
        print("❌ Error fetching property:", e)
        return jsonify({"error": str(e)}), 500


# PUT: Update Property
@bp.route("/<id>", methods=["PUT"])
def update_property(id):
    try:
        data = request.json
        result = db.properties.update_one({"_id": ObjectId(id)}, {"$set": data})
        if result.modified_count == 1:
            return jsonify({"message": "Property updated"}), 200
        return jsonify({"error": "Property not found or not modified"}), 404
    except Exception as e:
        return jsonify({"error": f"Error updating property: {str(e)}"}), 500


# DELETE: Delete Property
@bp.route("/<id>", methods=["DELETE"])
def delete_property(id):
    try:
        result = db.properties.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Property deleted"}), 200
        return jsonify({"error": "Property not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Error deleting property: {str(e)}"}), 500
