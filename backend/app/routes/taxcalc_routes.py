from flask import Blueprint, request, jsonify
from app.services.taxcalc_service import (
    calculate_tax_all,
    get_tax_deductions_breakdown,
    get_tax_holding_costs,
    get_tax_holding_costs_years,
    get_tax_yearly_data
)

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
