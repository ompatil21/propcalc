from flask import Blueprint, request, jsonify
from app.db import db
from app.models.property import property_serializer
from app.services.portfolio_service import (
    get_dashboard_summary,
    get_portfolio_growth_chart,
    get_portfolio_cash_flow_chart,
    get_portfolio_summary_cards,
)

portfolio_bp = Blueprint("portfolio", __name__, url_prefix="/api/portfolio")


def fetch_properties_by_email(email):
    return list(db.properties.find({"email": email}))


def extract_email_from_request():
    try:
        if not request.is_json:
            return None, jsonify({"error": "Invalid or missing JSON payload"}), 400

        data = request.get_json()
        email = data.get("email")
        if not email:
            return None, jsonify({"error": "Missing user email"}), 400

        return email, None, None
    except Exception as e:
        return None, jsonify({"error": f"Error parsing JSON: {str(e)}"}), 400


@portfolio_bp.route("", methods=["POST"])
def portfolio_overview():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON body"}), 400

        email = data.get("email")
        if not email:
            return jsonify({"error": "Missing user email"}), 400

        properties = fetch_properties_by_email(email)
        mapped = [property_serializer(p) for p in properties]

        print("✅ Email:", email)
        print("✅ Properties:", properties)
        print("✅ Mapped:", mapped)

        # 🔥 FIX: Wrap in dictionary
        result = get_dashboard_summary({"properties": mapped})
        return jsonify(result), 200

    except Exception as e:
        print("🔥 Exception in portfolio_overview:", str(e))
        return jsonify({"error": str(e)}), 500


@portfolio_bp.route("/growth", methods=["POST"])
def portfolio_growth():
    try:
        email, error_response, status = extract_email_from_request()
        if error_response:
            return error_response, status

        properties = fetch_properties_by_email(email)
        mapped = [property_serializer(p) for p in properties if p]
        result = get_portfolio_growth_chart({"properties": mapped})
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@portfolio_bp.route("/cashflow", methods=["POST"])
def portfolio_cashflow():
    try:
        email, error_response, status = extract_email_from_request()
        if error_response:
            return error_response, status

        properties = fetch_properties_by_email(email)
        mapped = [property_serializer(p) for p in properties if p]
        result = get_portfolio_cash_flow_chart({"properties": mapped})
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@portfolio_bp.route("/summary", methods=["POST"])
def portfolio_summary():
    try:
        email, error_response, status = extract_email_from_request()
        if error_response:
            return error_response, status

        properties = fetch_properties_by_email(email)
        mapped = [property_serializer(p) for p in properties if p]
        result = get_portfolio_summary_cards({"properties": mapped})
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
