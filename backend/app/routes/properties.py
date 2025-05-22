from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import db
from app.models.property import property_serializer
from datetime import datetime
from bson.objectid import ObjectId
from cerberus import Validator

bp = Blueprint("properties", __name__, url_prefix="/api/properties")

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
}


@bp.route("", methods=["POST", "OPTIONS"])
@jwt_required()
def create_property():
    if request.method == "OPTIONS":
        return "", 200
    ...

    user_id = get_jwt_identity()

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

        parsed = {
            "title": data["title"],
            "location": data["location"],
            "type": data["type"],
            "state": data["state"],
            "purchase_price": float(data["purchase_price"]),
            "deposit": float(data["deposit"]),
            "loan_amount": float(data.get("loan_amount", 0)),
            "interest_rate": float(data.get("interest_rate", 0)),
            "loan_term": int(data.get("loan_term", 0)),
            "lvr": float(data.get("lvr", 0)),
            "lmiRequired": data.get("lmiRequired", False),
            "rent": float(data.get("rent", 0)),
            "rentPerWeek": float(data.get("rentPerWeek", 0)),
            "weeksRented": int(data.get("weeksRented", 0)),
            "vacancy_rate": float(data.get("vacancy_rate", 0)),
            "council_rates": float(data.get("council_rates", 0)),
            "insurance": float(data.get("insurance", 0)),
            "maintenance": float(data.get("maintenance", 0)),
            "property_manager": float(data.get("property_manager", 0)),
            "wage_growth": float(data.get("wage_growth", 0)),
            "stamp_duty": float(data.get("stamp_duty", 0)),
            "gst": float(data.get("gst", 0)),
            "legal_fees": float(data.get("legal_fees", 0)),
            "disbursements": float(data.get("disbursements", 0)),
            "building_inspection": float(data.get("building_inspection", 0)),
            "registration_title": float(data.get("registration_title", 0)),
            "mortgage_stamp_duty": float(data.get("mortgage_stamp_duty", 0)),
            "mortgage_insurance_1": float(data.get("mortgage_insurance_1", 0)),
            "stamp_duty_mi_1": float(data.get("stamp_duty_mi_1", 0)),
            "mortgage_insurance_2": float(data.get("mortgage_insurance_2", 0)),
            "stamp_duty_mi_2": float(data.get("stamp_duty_mi_2", 0)),
            "loan_app_fee": float(data.get("loan_app_fee", 0)),
            "valuation_fee": float(data.get("valuation_fee", 0)),
            "search_fees": float(data.get("search_fees", 0)),
            "registration_mortgage": float(data.get("registration_mortgage", 0)),
            "date_of_purchase": data["date_of_purchase"],
            "date_of_construction": data["date_of_construction"],
            "date_of_sale": data.get("date_of_sale"),
            "rental_growth": float(data.get("rental_growth", 0)),
            "capital_growth_rate": float(data.get("capital_growth_rate", 0)),
            "buildings_value": float(data.get("buildings_value", 0)),
            "fittings_value": float(data.get("fittings_value", 0)),
            "inflation": float(data.get("inflation", 0)),
            "preferred_lvr": float(data.get("preferred_lvr", 0)),
            "owners": data["owners"],
            "user_id": user_id,
            "createdAt": datetime.utcnow(),
            "medicare_surcharge": bool(data.get("medicare_surcharge", False)),
            "bookkeeping": float(data.get("bookkeeping", 0)),
            "holding_years": int(data.get("holding_years", 10)),
            "once_off_expenses": float(data.get("once_off_expenses", 0)),
            "pest_control": float(data.get("pest_control", 0)),
            "postage": float(data.get("postage", 0)),
            "tax_related_expenses": float(data.get("tax_related_expenses", 0)),
            "travel": float(data.get("travel", 0)),
            "cleaning": float(data.get("cleaning", 0)),
            "gardening": float(data.get("gardening", 0)),
            "land_tax": float(data.get("land_tax", 0)),
            "legal_expenses": float(data.get("legal_expenses", 0)),
            "strata": float(data.get("strata", 0)),
            "water": float(data.get("water", 0)),
        }

        result = db.properties.insert_one(parsed)

        if not result.inserted_id:
            return jsonify({"error": "Insert failed"}), 500

        new_doc = db.properties.find_one({"_id": result.inserted_id})
        return jsonify(property_serializer(new_doc)), 201

    except Exception as e:
        print("❌ Error inserting property:", e)
        return jsonify({"error": str(e)}), 500


from flask_jwt_extended import jwt_required, get_jwt_identity
from app.db import db
from app.models.property import property_serializer


# ✅ New GET route for current user
@bp.route("/user", methods=["GET"])
@jwt_required()
def get_user_properties():
    user = get_jwt_identity()

    if not user or not user.get("email"):
        return jsonify({"error": "Unauthorized"}), 401

    user_email = user["email"]
    properties = list(db.properties.find({"user_id.email": user_email}))

    serialized = [property_serializer(p) for p in properties]
    return jsonify(serialized), 200


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
