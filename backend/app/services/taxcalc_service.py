from typing import Dict, Any, List
from datetime import datetime

WEEKS_PER_YEAR = 52.25

MARGINAL_TAX_BRACKETS = [
    (18200, 0.0), (45000, 0.19), (120000, 0.325), (180000, 0.37), (float('inf'), 0.45),
]
MEDICARE_LEVY_RATE = 0.02
MEDICARE_SURCHARGE_THRESHOLDS = [(90000, 0.0), (105000, 0.01), (140000, 0.0125), (float('inf'), 0.015)]

TRANSFER_STAMP_DUTY_RATES = {
    'VIC': 0.055, 'NSW': 0.045, 'QLD': 0.035, 'WA': 0.048, 'SA': 0.046, 'TAS': 0.04, 'ACT': 0.04, 'NT': 0.045
}
MORTGAGE_STAMP_DUTY_RATES = {
    'VIC': 0.0038, 'NSW': 0.004, 'QLD': 0.004, 'WA': 0.004, 'SA': 0.004, 'TAS': 0.004, 'ACT': 0.004, 'NT': 0.004
}

def get_marginal_tax_rate(income: float) -> float:
    for threshold, rate in MARGINAL_TAX_BRACKETS:
        if income <= threshold:
            return rate
    return 0.45

def get_medicare_surcharge(income: float, has_private_health: bool) -> float:
    if has_private_health:
        return 0.0
    for threshold, rate in MEDICARE_SURCHARGE_THRESHOLDS:
        if income <= threshold:
            return income * rate
    return 0.0

def apply_growth(value: float, rate: float, year: int) -> float:
    return value * ((1 + rate) ** (year - 1))

def safe_float(val):
    try:
        return float(val)
    except (TypeError, ValueError):
        return 0.0

def calculate_tax_all(data: Dict[str, Any]) -> Dict[str, Any]:
    # --- Inputs ---
    state = (data.get('state') or 'VIC').upper()
    purchase_price = safe_float(data.get('purchase_price'))
    loan_amount = safe_float(data.get('loan_amount')) or (purchase_price - safe_float(data.get('deposit', 0)))
    rent_per_week = safe_float(data.get('rentPerWeek'))
    weeks_rented = int(data.get('weeksRented', 50))
    interest_loan_1 = safe_float(data.get('interestLoan1'))
    interest_loan_2 = safe_float(data.get('interestLoan2'))
    interest_rate = safe_float(data.get('interestRate', 0.037))
    property_manager_rate = safe_float(data.get('propertyManager'))
    letting_fee_weeks = safe_float(data.get('lettingFeeWeeks'))
    insurance = safe_float(data.get('insurance'))
    maintenance = safe_float(data.get('maintenance'))
    strata = safe_float(data.get('strata'))
    water_charges = safe_float(data.get('waterCharges'))
    cleaning = safe_float(data.get('cleaning'))
    council_rates = safe_float(data.get('councilRates'))
    gardening = safe_float(data.get('gardening'))
    land_tax = safe_float(data.get('landTax'))
    legal_expenses = safe_float(data.get('legalExpenses'))
    pest_control = safe_float(data.get('pestControl'))
    bookkeeping = safe_float(data.get('bookkeeping'))
    postage = safe_float(data.get('postage'))
    tax_related_expenses = safe_float(data.get('taxRelatedExpenses'))
    travel = safe_float(data.get('travel'))
    once_off_expenses = safe_float(data.get('onceOffExpenses'))
    borrowing_costs = safe_float(data.get('borrowingCosts'))
    depreciation_buildings = safe_float(data.get('depreciationBuildings'))
    depreciation_fittings = safe_float(data.get('depreciationFittings'))
    holding_years = min(int(data.get('holdingYears', 10)), 15)
    wage_growth = safe_float(data.get('wageGrowth'))
    rental_growth = safe_float(data.get('rentalGrowth'))
    inflation = safe_float(data.get('inflation'))
    capital_growth = safe_float(data.get('capitalGrowth'))
    has_private_health = data.get('hasPrivateHealthCover', False)
    owners = data.get('owners', [])
    for o in owners:
        o['ownership'] = safe_float(o.get('ownership', 0))
        o['income'] = safe_float(o.get('income', 0))

    # --- Stamp Duties ---
    transfer_stamp_duty = purchase_price * TRANSFER_STAMP_DUTY_RATES.get(state, 0.055)
    mortgage_stamp_duty = loan_amount * MORTGAGE_STAMP_DUTY_RATES.get(state, 0.0038)
    upfront_costs = transfer_stamp_duty + mortgage_stamp_duty + legal_expenses

    # --- Days Owned ---
    date_of_purchase = data.get('dateOfPurchase')
    date_of_sale = data.get('dateOfSale')
    try:
        purchase_dt = datetime.strptime(str(date_of_purchase)[:10], "%Y-%m-%d")
    except Exception:
        purchase_dt = None
    if date_of_sale:
        try:
            sale_dt = datetime.strptime(str(date_of_sale)[:10], "%Y-%m-%d")
        except Exception:
            sale_dt = datetime.today()
    else:
        sale_dt = datetime.today()
    days_owned = (sale_dt - purchase_dt).days if purchase_dt else 0

    yearly = []
    total_profits = []
    cumulative_cash_flow = []
    cumulative_profit = []
    cum_cf = 0
    cum_profit = 0
    fitting_value = depreciation_fittings

    for year in range(1, holding_years + 1):
        rent = apply_growth(rent_per_week, rental_growth, year) * weeks_rented
        property_management = rent * property_manager_rate / 100
        letting_fee = apply_growth(rent_per_week, rental_growth, year) * letting_fee_weeks
        insurance_ = apply_growth(insurance, inflation, year)
        maintenance_ = apply_growth(maintenance, inflation, year)
        strata_ = apply_growth(strata, inflation, year)
        water_ = apply_growth(water_charges, inflation, year)
        cleaning_ = apply_growth(cleaning, inflation, year)
        council_ = apply_growth(council_rates, inflation, year)
        gardening_ = apply_growth(gardening, inflation, year)
        land_tax_ = apply_growth(land_tax, inflation, year)
        legal_ = apply_growth(legal_expenses, inflation, year)
        pest_ = apply_growth(pest_control, inflation, year)
        bookkeeping_ = apply_growth(bookkeeping, inflation, year)
        postage_ = apply_growth(postage, inflation, year)
        tax_related_ = apply_growth(tax_related_expenses, inflation, year)
        travel_ = apply_growth(travel, inflation, year)
        once_off_ = once_off_expenses if year == 1 else 0

        total_expenses = sum([
            interest_loan_1, interest_loan_2, property_management, letting_fee, insurance_, maintenance_,
            strata_, water_, cleaning_, council_, gardening_, land_tax_, legal_, pest_,
            bookkeeping_, postage_, tax_related_, travel_, once_off_
        ])

        property_expenses = total_expenses - (interest_loan_1 + interest_loan_2)
        total_cash_deductions = interest_loan_1 + interest_loan_2 + property_expenses

        borrowing_costs_annual = borrowing_costs / 5 if year <= 5 else 0
        dep_buildings = depreciation_buildings
        dep_fittings = fitting_value * 0.3 if fitting_value > 0 else 0
        fitting_value = max(fitting_value - dep_fittings, 0)
        total_non_cash_deductions = borrowing_costs_annual + dep_buildings + dep_fittings
        total_claimable_deductions = total_cash_deductions + total_non_cash_deductions

        pre_tax_cash_flow = rent - total_expenses
        pre_tax_cash_flow_week = pre_tax_cash_flow / WEEKS_PER_YEAR
        net_income = rent - total_expenses - total_non_cash_deductions

        total_profit = pre_tax_cash_flow + total_non_cash_deductions
        cum_cf += pre_tax_cash_flow
        cum_profit += total_profit
        total_profits.append(round(total_profit, 2))
        cumulative_cash_flow.append(round(cum_cf, 2))
        cumulative_profit.append(round(cum_profit, 2))

        # --- Owners breakdown ---
        owners_data = []
        for owner in owners:
            share = owner['ownership'] / 100
            owner_income = apply_growth(owner['income'], wage_growth, year)
            taxable_income_reduction = total_claimable_deductions * share
            post_invest_salary = owner_income - taxable_income_reduction
            pre_tax_paid = owner_income * get_marginal_tax_rate(owner_income)
            post_tax_paid = post_invest_salary * get_marginal_tax_rate(post_invest_salary)
            tax_credit_per_annum = pre_tax_paid - post_tax_paid
            tax_credit_per_week = tax_credit_per_annum / WEEKS_PER_YEAR
            medicare_levy = owner_income * MEDICARE_LEVY_RATE
            medicare_surcharge = get_medicare_surcharge(owner_income, has_private_health)
            after_tax_cash_flow = pre_tax_cash_flow * share + tax_credit_per_annum - medicare_levy - medicare_surcharge
            after_tax_cash_flow_week = after_tax_cash_flow / WEEKS_PER_YEAR

            owners_data.append({
                "name": owner.get('name', f'Owner {year}'),
                "ownership": owner['ownership'],
                "income": round(owner_income, 2),
                "taxable_income_reduction": round(taxable_income_reduction, 2),
                "post_invest_salary": round(post_invest_salary, 2),
                "pre_tax_paid": round(pre_tax_paid, 2),
                "post_tax_paid": round(post_tax_paid, 2),
                "tax_credit_per_annum": round(tax_credit_per_annum, 2),
                "tax_credit_per_week": round(tax_credit_per_week, 2),
                "medicare_levy": round(medicare_levy, 2),
                "medicare_surcharge": round(medicare_surcharge, 2),
                "after_tax_cash_flow": round(after_tax_cash_flow, 2),
                "after_tax_cash_flow_week": round(after_tax_cash_flow_week, 2),
            })

        yearly.append({
            "year": year,
            "total_rent": round(rent, 2),
            "total_expenses": round(total_expenses, 2),
            "pre_tax_cash_flow": round(pre_tax_cash_flow, 2),
            "pre_tax_cash_flow_week": round(pre_tax_cash_flow_week, 2),
            "total_cash_deductions": round(total_cash_deductions, 2),
            "property_expenses": round(property_expenses, 2),
            "borrowing_costs_annual": round(borrowing_costs_annual, 2),
            "dep_buildings": round(dep_buildings, 2),
            "dep_fittings": round(dep_fittings, 2),
            "total_non_cash_deductions": round(total_non_cash_deductions, 2),
            "total_claimable_deductions": round(total_claimable_deductions, 2),
            "net_income": round(net_income, 2),
            "total_profit": round(total_profit, 2),
            "cumulative_cash_flow": round(cum_cf, 2),
            "cumulative_profit": round(cum_profit, 2),
            "owners": owners_data
        })

    # --- Deductions Pie (for charts) ---
    deductions_breakdown = {
        "Interest": loan_amount * interest_rate,
        "Council Rates": council_rates,
        "Insurance": insurance,
        "Maintenance": maintenance,
        "Property Management": property_manager_rate / 100 * rent_per_week * weeks_rented,
        "Letting Fee": letting_fee_weeks * rent_per_week,
        "Legal Fees": legal_expenses,
        "Depreciation Building": depreciation_buildings,
        "Depreciation Fittings": depreciation_fittings,
    }
    deductions_pie = {
        "labels": list(deductions_breakdown.keys()),
        "data": [float(v) for v in deductions_breakdown.values()]
    }

    # --- Holding Costs Pie (for charts) ---
    holding_costs = {
        "labels": ["You", "Tax Office", "Tenant"],
        "data": [
            sum(deductions_breakdown.values()),
            transfer_stamp_duty + mortgage_stamp_duty,
            rent_per_week * weeks_rented
        ]
    }

    # --- Yearly holding costs (for charts) ---
    holding_costs_years = []
    for y in yearly:
        holding_costs_years.append({
            "year": y["year"],
            "labels": ["You", "Tax Office", "Tenant"],
            "data": [
                y["total_expenses"] + y["total_non_cash_deductions"],
                transfer_stamp_duty if y["year"] == 1 else 0,
                y["total_rent"]
            ]
        })

    # --- Owners summary (for charts/tables) ---
    owners_summary = [
        {
            "name": o.get("name", f"Owner {i+1}"),
            "ownership": o["ownership"],
            "income": o["income"]
        }
        for i, o in enumerate(owners)
    ]

    # --- State Reference (for sale etc) ---
    agent_commission_rate = 0.03
    sale_price = safe_float(data.get('sale_price', purchase_price * 1.3))
    agent_commission = sale_price * agent_commission_rate
    sales_costs = 3000
    capital_gain = sale_price - purchase_price
    building_depreciation_added = depreciation_buildings * holding_years
    real_capital_gain = capital_gain + building_depreciation_added
    taxable_capital_gain = real_capital_gain * 0.5
    owner_portions = [owner['ownership'] / 100 * taxable_capital_gain for owner in owners]

    return {
        "days_owned": days_owned,
        "transfer_stamp_duty": round(transfer_stamp_duty, 2),
        "mortgage_stamp_duty": round(mortgage_stamp_duty, 2),
        "upfront_costs": round(upfront_costs, 2),
        "yearly": yearly,
        "owners_summary": owners_summary,
        "deductions": deductions_pie,
        "holdingCosts": holding_costs,
        "holdingCostsYears": holding_costs_years,
        "total_profit_per_year": total_profits,
        "cumulative_cash_flow": cumulative_cash_flow,
        "cumulative_profit": cumulative_profit,
        "state_reference": {
            "agent_commission": round(agent_commission, 2),
            "sales_costs": round(sales_costs, 2),
            "capital_gain": round(capital_gain, 2),
            "building_depreciation_added": round(building_depreciation_added, 2),
            "real_capital_gain": round(real_capital_gain, 2),
            "taxable_capital_gain": round(taxable_capital_gain, 2),
            "owner_portions": [round(x, 2) for x in owner_portions]
        }
    }

def get_tax_deductions_breakdown(data: Dict[str, Any]) -> Dict[str, Any]:
    return calculate_tax_all(data)["deductions"]

def get_tax_holding_costs(data: Dict[str, Any]) -> Dict[str, Any]:
    return calculate_tax_all(data)["holdingCosts"]

def get_tax_holding_costs_years(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    return calculate_tax_all(data)["holdingCostsYears"]

def get_tax_yearly_data(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    return calculate_tax_all(data)["yearly"]
