from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.taxcalc_service import (
    calculate_tax_all,
    get_tax_deductions_breakdown,
    get_tax_holding_costs,
    get_tax_holding_costs_years,
    get_tax_yearly_data,
)
from flask import request, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId
from app import mongo
from app.services.taxcalc_service import calculate_tax_all

taxcalc_bp = Blueprint("taxcalc", __name__, url_prefix="/api/tax-calc")


@taxcalc_bp.route("", methods=["POST"])
def calculate_tax_route():
    from flask import current_app
    import traceback

    try:
        data = request.get_json(force=True) or {}
        print("📥 Received payload:")
        print(data)

        result = calculate_tax_all(data)
        print("✅ Tax calculation successful")
        return jsonify(result), 200
    except Exception as e:
        print("❌ Error in calculate_tax_route:")
        print("Exception:", e)
        traceback.print_exc()  # <-- full traceback
        return jsonify({"error": str(e)}), 500


@taxcalc_bp.route("/deductions", methods=["POST"])
def tax_deductions():
    try:
        data = request.get_json() or {}
        result = get_tax_deductions_breakdown(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@taxcalc_bp.route("/holding-costs", methods=["POST"])
def tax_holding_costs():
    try:
        data = request.get_json() or {}
        result = get_tax_holding_costs(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@taxcalc_bp.route("/holding-costs-years", methods=["POST"])
def tax_holding_costs_years():
    try:
        data = request.get_json() or {}
        result = get_tax_holding_costs_years(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@taxcalc_bp.route("/yearly-data", methods=["POST"])
def tax_yearly_data():
    try:
        data = request.get_json() or {}
        result = get_tax_yearly_data(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@taxcalc_bp.route("/calculate-from-property/<property_id>", methods=["POST"])
@jwt_required()
def calculate_from_property(property_id):
    try:
        property_doc = mongo.db.properties.find_one({"_id": ObjectId(property_id)})
        if not property_doc:
            return jsonify({"error": "Property not found"}), 404

        # Convert Mongo fields to frontend-style payload
        def prepare_tax_payload(p):
            return {
                "state": p.get("state", "VIC"),
                "dateOfPurchase": p.get("date_of_purchase"),
                "dateOfSale": p.get("date_of_sale"),
                "holdingYears": str(p.get("holding_years", 10)),
                "rentPerWeek": str(p.get("rentPerWeek", "")),
                "weeksRented": str(p.get("weeksRented", 50)),
                "interestLoan1": str(p.get("interestLoan1", "")),
                "interestLoan2": str(p.get("interestLoan2", "")),
                "interestRate": str(p.get("interest_rate", 0.037)),
                "propertyManager": str(p.get("property_manager", 7)),
                "lettingFeeWeeks": str(p.get("lettingFeeWeeks", 1)),
                "insurance": str(p.get("insurance", "")),
                "maintenance": str(p.get("maintenance", "")),
                "strata": str(p.get("strata", "")),
                "waterCharges": str(p.get("water", "")),
                "cleaning": str(p.get("cleaning", "")),
                "councilRates": str(p.get("council_rates", "")),
                "gardening": str(p.get("gardening", "")),
                "landTax": str(p.get("land_tax", "")),
                "legalExpenses": str(p.get("legal_expenses", "")),
                "pestControl": str(p.get("pest_control", "")),
                "bookkeeping": str(p.get("bookkeeping", "")),
                "postage": str(p.get("postage", "")),
                "taxRelatedExpenses": str(p.get("tax_related_expenses", "")),
                "travel": str(p.get("travel", "")),
                "onceOffExpenses": str(p.get("once_off_expenses", "")),
                "borrowingCosts": str(p.get("borrowing_costs", "")),
                "depreciationBuildings": str(p.get("buildings_value", "")),
                "depreciationFittings": str(p.get("fittings_value", "")),
                "wageGrowth": str(p.get("wage_growth", 0.02)),
                "rentalGrowth": str(p.get("rental_growth", 0.035)),
                "inflation": str(p.get("inflation", 0.025)),
                "capitalGrowth": str(p.get("capital_growth_rate", 0.08)),
                "hasPrivateHealthCover": p.get("medicare_surcharge", False),
                "purchase_price": str(p.get("purchase_price", "")),
                "sale_price": str(p.get("sale_price", "")),
                "owners": [
                    {
                        "name": o.get("name"),
                        "ownership": float(o.get("ownership", 0)),
                        "income": float(o.get("income", 0)),
                    }
                    for o in p.get("owners", [])
                ],
            }

        payload = prepare_tax_payload(property_doc)
        result = calculate_tax_all(payload)

        return jsonify(result), 200

    except Exception as e:
        print("❌ Error in /calculate-from-property:", e)
        return jsonify({"error": str(e)}), 500
