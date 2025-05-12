def run_property_simulation(data):
    purchase_price = data["purchase_price"]
    down_payment = data["down_payment"]
    loan_interest = data["loan_interest"] / 100
    rental_income = data["rental_income"]
    property_expenses = data.get("expenses", {})
    monthly_expenses = float(property_expenses.get("monthly_expenses", 0))
    holding_years = data["holding_years"]
    growth_rate = data["growth_rate"] / 100

    loan_amount = purchase_price - down_payment
    annual_interest = loan_amount * loan_interest
    annual_expenses = monthly_expenses * 12
    annual_cash_flow = rental_income * 12 - annual_expenses - annual_interest

    portfolio_growth = []
    profit_per_year = []
    appraisal_values = []
    cumulative_cash_flow = 0
    cumulative_profit = 0
    cumulative_cash_flow_series = []
    cumulative_profit_series = []
    after_tax_cash_flows = []

    for year in range(1, holding_years + 1):
        value = purchase_price * ((1 + growth_rate) ** year)
        appraisal_values.append({"year": year, "value": round(value, 2)})
        profit = value - purchase_price
        profit_per_year.append({"year": year, "profit": round(profit, 2)})
        cumulative_profit += profit
        cumulative_profit_series.append({"year": year, "value": round(cumulative_profit, 2)})
        after_tax = annual_cash_flow * 0.7
        after_tax_cash_flows.append({"year": year, "value": round(after_tax, 2)})
        cumulative_cash_flow += after_tax
        cumulative_cash_flow_series.append({"year": year, "value": round(cumulative_cash_flow, 2)})
        portfolio_growth.append({"year": year, "value": round(value, 2)})

    holding_costs_chart = []
    for y in [1, 5, 10, 15]:
        if y <= holding_years:
            total_holding = annual_expenses * y
            holding_costs_chart.append({"year": y, "cost": round(total_holding, 2)})

    return {
        "holding_costs": round(annual_expenses, 2),
        "cash_flow": round(annual_cash_flow, 2),
        "before_tax_profit": round(sum(p["profit"] for p in profit_per_year), 2),
        "after_tax_profit": round(sum(p["profit"] for p in profit_per_year) * 0.7, 2),
        "appraisal_values": appraisal_values,
        "profit_per_year": profit_per_year,
        "portfolio_growth": portfolio_growth,
        "charts": {
            "holding_costs_selected_years": holding_costs_chart,
            "after_tax_cash_flow": after_tax_cash_flows,
            "cumulative_cash_flow": cumulative_cash_flow_series,
            "cumulative_profit": cumulative_profit_series,
            "property_value_over_time": portfolio_growth,
            "total_profit_per_year": profit_per_year
        }
    }
