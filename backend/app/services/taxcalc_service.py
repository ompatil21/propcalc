STAMP_DUTY_RATES = {
    'VIC': 0.055,
    'NSW': 0.045,
    'QLD': 0.035,
    'WA': 0.048,
    'SA': 0.046
}

def calculate_stamp_duty(price, state):
    rate = STAMP_DUTY_RATES.get(state.upper(), 0.05)
    return price * rate

def calculate_rental_income_tax(annual_rent_income, total_income):
    tax_rate = 0.32 if total_income <= 180000 else 0.37
    return annual_rent_income * tax_rate

def calculate_cgt(purchase_price, sale_price, owner_percentage, years_held):
    gain = sale_price - purchase_price
    if years_held > 1:
        gain *= 0.5
    owner_gain = gain * (owner_percentage / 100)
    tax_rate = 0.32
    return owner_gain * tax_rate

def calculate_tax_summary(data):
    purchase_price = data['purchase_price']
    state = data['property_state']
    income = data['income']
    rent_income = data['annual_rent_income']
    holding_years = data['holding_years']
    sale_price = data['sale_price']
    owner_percentage = data['owner_percentage']
    expenses = data['expenses']
    growth_rate = data['growth_rate'] / 100

    annual_expenses = sum(float(v or 0) for v in expenses.values())
    stamp_duty = calculate_stamp_duty(purchase_price, state)
    rental_tax = calculate_rental_income_tax(rent_income, income)
    cgt = calculate_cgt(purchase_price, sale_price, owner_percentage, holding_years)

    holding_costs = annual_expenses * holding_years
    total_rent_income = rent_income * holding_years
    before_tax_profit = (sale_price - purchase_price + total_rent_income) - holding_costs
    after_tax_profit = before_tax_profit - (rental_tax + cgt + stamp_duty)

    appraisal_values = []
    profit_per_year = []
    for year in range(1, holding_years + 1):
        value = purchase_price * ((1 + growth_rate) ** year)
        profit = value - purchase_price
        appraisal_values.append({"year": year, "value": round(value, 2)})
        profit_per_year.append({"year": year, "profit": round(profit, 2)})

    return {
        "stamp_duty": round(stamp_duty, 2),
        "rental_income_tax": round(rental_tax, 2),
        "capital_gains_tax": round(cgt, 2),
        "holding_costs": round(holding_costs, 2),
        "before_tax_profit": round(before_tax_profit, 2),
        "after_tax_profit": round(after_tax_profit, 2),
        "appraisal_values": appraisal_values,
        "profit_per_year": profit_per_year
    }
