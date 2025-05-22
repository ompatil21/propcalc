def get_dashboard_summary(data):
    if not isinstance(data, dict):
        raise ValueError("Expected a dictionary, got None or invalid type.")

    properties = data.get("properties", [])
    if not isinstance(properties, list):
        raise ValueError("Expected 'properties' to be a list.")

    total_value = 0
    total_cash_flow = 0
    total_expenses = 0
    total_income = 0
    growth_chart = []
    cash_flow_chart = []
    total_cap_rate = 0

    for prop in properties:
        if not isinstance(prop, dict):
            continue

        try:
            purchase_price = float(prop.get("purchase_price", 0))
            down_payment = float(prop.get("down_payment", 0))
            loan_interest = float(prop.get("loan_interest", 0)) / 100
            rental_income = float(prop.get("rental_income", 0))
            holding_years = int(prop.get("holding_years", 10))
            growth_rate = float(prop.get("growth_rate", 0)) / 100

            # ⚠️ Hardcoded monthly expenses (if needed) or just use 0
            monthly_expenses = 0.0  # Since no expenses field

        except (ValueError, TypeError) as e:
            print(f"Skipping property due to error: {e}")
            continue

        loan_amount = purchase_price - down_payment
        annual_interest = loan_amount * loan_interest
        annual_expenses = monthly_expenses * 12
        annual_cash_flow = rental_income * 12 - annual_expenses - annual_interest

        total_cash_flow += annual_cash_flow
        total_expenses += annual_expenses
        total_income += rental_income * 12
        total_value += purchase_price

        cap_rate = (
            ((rental_income * 12) - annual_expenses) / purchase_price
            if purchase_price
            else 0
        )
        total_cap_rate += cap_rate

        for year in range(1, holding_years + 1):
            value = purchase_price * ((1 + growth_rate) ** year)

            while len(growth_chart) < year:
                growth_chart.append({"year": len(growth_chart) + 1, "value": 0})
            growth_chart[year - 1]["value"] += round(value, 2)

            while len(cash_flow_chart) < year:
                cash_flow_chart.append(
                    {
                        "year": len(cash_flow_chart) + 1,
                        "income": 0,
                        "expenses": 0,
                        "net": 0,
                    }
                )
            cash_flow_chart[year - 1]["income"] += round(rental_income * 12, 2)
            cash_flow_chart[year - 1]["expenses"] += round(annual_expenses, 2)
            cash_flow_chart[year - 1]["net"] += round(annual_cash_flow, 2)

    avg_cap_rate = (total_cap_rate / len(properties)) * 100 if properties else 0

    return {
        "summary": {
            "portfolio_value": round(total_value, 2),
            "monthly_cash_flow": round(total_cash_flow / 12, 2),
            "total_properties": len(properties),
            "average_cap_rate": round(avg_cap_rate, 2),
        },
        "charts": {
            "portfolio_growth": growth_chart,
            "cash_flow_breakdown": cash_flow_chart,
        },
    }


def get_portfolio_growth_chart(data):
    try:
        return get_dashboard_summary(data)["charts"]["portfolio_growth"]
    except Exception as e:
        print(f"Error in get_portfolio_growth_chart: {e}")
        return []


def get_portfolio_cash_flow_chart(data):
    try:
        return get_dashboard_summary(data)["charts"]["cash_flow_breakdown"]
    except Exception as e:
        print(f"Error in get_portfolio_cash_flow_chart: {e}")
        return []


def get_portfolio_summary_cards(data):
    try:
        return get_dashboard_summary(data)["summary"]
    except Exception as e:
        print(f"Error in get_portfolio_summary_cards: {e}")
        return {}
