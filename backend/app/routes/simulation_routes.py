# backend/app/routes/simulation_routes.py

from flask import Blueprint, request, jsonify
from app.services.simulation_service import run_property_simulation

simulation_bp = Blueprint("simulation", __name__)

@simulation_bp.route("", methods=["POST"])
def run_simulation():
    try:
        data = request.json

        # Mapping frontend fields to backend logic
        purchase_price = float(data.get("purchasePrice", 0))
        down_payment_percent = float(data.get("downPayment", 0))
        down_payment = purchase_price * (down_payment_percent / 100)
        loan_interest = float(data.get("interestRate", 0))
        rental_income = float(data.get("monthlyRentalIncome", 0))
        monthly_expenses = float(data.get("monthlyExpenses", 0))
        holding_years = int(data.get("investmentPeriod", 10))
        growth_rate = float(data.get("annualAppreciation", 0))

        payload = {
            "purchase_price": purchase_price,
            "down_payment": down_payment,
            "loan_interest": loan_interest,
            "rental_income": rental_income,
            "expenses": {
                "monthly_expenses": monthly_expenses
            },
            "holding_years": holding_years,
            "growth_rate": growth_rate
        }

        result = run_property_simulation(payload)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
