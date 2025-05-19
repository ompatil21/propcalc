from flask import Blueprint, request, jsonify
from app.services.simulation_service import run_property_simulation

simulation_bp = Blueprint("simulation", __name__, url_prefix="/api/simulation")

@simulation_bp.route("", methods=["POST"])
def run_simulation():
    """
    Accepts a POST with a list of scenarios.
    Returns simulation results for each scenario for side-by-side comparison.
    """
    try:
        data = request.get_json() or {}
        result = run_property_simulation(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
