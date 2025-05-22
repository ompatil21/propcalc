from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId

property_bp = Blueprint("property", __name__)


# GET by email
@property_bp.route("/", methods=["GET"])
def get_properties_by_email():
    email = request.args.get("email")
    if not email:
        return jsonify({"message": "Email is required"}), 400

    properties = list(current_app.db.property.find({"email": email}))
    for prop in properties:
        prop["_id"] = str(prop["_id"])
    return jsonify(properties)


# GET by ID
@property_bp.route("/<string:property_id>", methods=["GET"])
def get_property_by_id(property_id):
    try:
        property = current_app.db.property.find_one({"_id": ObjectId(property_id)})
        if not property:
            return jsonify({"message": "Property not found"}), 404
        property["_id"] = str(property["_id"])
        return jsonify(property)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# DELETE
@property_bp.route("/<string:property_id>", methods=["DELETE"])
def delete_property(property_id):
    try:
        result = current_app.db.property.delete_one({"_id": ObjectId(property_id)})
        if result.deleted_count == 0:
            return jsonify({"message": "Property not found"}), 404
        return jsonify({"message": "Property deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
