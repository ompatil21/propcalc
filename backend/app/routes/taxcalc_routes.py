# backend/app/routes/taxcalc_routes.py

from flask import Blueprint, request, jsonify
from app.services.taxcalc_service import calculate_tax_summary

taxcalc_bp = Blueprint("taxcalc", __name__)

@taxcalc_bp.route("", methods=["POST"])
def calculate_tax():
    try:
        data = request.json

        transformed_data = {
            "purchase_price": float(data.get("propertyValue", 0)),
            "property_state": "VIC",
            "income": float(data.get("annualIncome", 0)),
            "annual_rent_income": float(data.get("rentalIncome", 0)),
            "holding_years": 15,
            "sale_price": float(data.get("propertyValue", 0)) * 1.3,
            "owner_percentage": 100,
            "growth_rate": 3.0,
            "expenses": {
                "mortgage_interest": float(data.get("mortgageInterest", 0)),
                "property_expenses": float(data.get("propertyExpenses", 0)),
                "property_taxes": float(data.get("propertyValue", 0)) * 0.01,
                "depreciation": float(data.get("propertyValue", 0)) * 0.036
            }
        }

        result = calculate_tax_summary(transformed_data)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
