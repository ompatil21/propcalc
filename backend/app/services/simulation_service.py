from app.services.taxcalc_service import calculate_tax_all


def run_property_simulation(data):
    """
    Accepts a list of scenarios.
    For each scenario, runs the tax calculation and returns results for comparison.
    """
    scenarios = data.get("scenarios", [])
    results = []
    for scenario in scenarios:
        label = scenario.get("label", "Scenario")
        scenario_result = calculate_tax_all(scenario)
        results.append({
            "label": label,
            "result": scenario_result
        })
    return {"scenarios": results}
