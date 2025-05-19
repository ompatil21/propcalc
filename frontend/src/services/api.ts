function toNumber(value: any) {
  const num = parseFloat(value)
  return isNaN(num) ? 0 : num
}

function toInteger(value: any) {
  const int = parseInt(value)
  return isNaN(int) ? 0 : int
}

export async function createProperty(data: any) {
  const token = localStorage.getItem("accessToken")

  // 🛠️ Convert string fields to correct types
  const transformed = {
    ...data,
    purchase_price: toNumber(data.purchase_price),
    deposit: toNumber(data.deposit),
    loan_amount: toNumber(data.loan_amount),
    interest_rate: toNumber(data.interest_rate),
    loan_term: toInteger(data.loan_term),
    lvr: toNumber(data.lvr),
    rent: toNumber(data.rent),
    rentPerWeek: toNumber(data.rentPerWeek),
    weeksRented: toInteger(data.weeksRented),
    vacancy_rate: toNumber(data.vacancy_rate),
    council_rates: toNumber(data.council_rates),
    insurance: toNumber(data.insurance),
    maintenance: toNumber(data.maintenance),
    property_manager: toNumber(data.property_manager),
    stamp_duty: toNumber(data.stamp_duty),
    gst: toNumber(data.gst),
    legal_fees: toNumber(data.legal_fees),
    disbursements: toNumber(data.disbursements),
    building_inspection: toNumber(data.building_inspection),
    registration_title: toNumber(data.registration_title),
    mortgage_stamp_duty: toNumber(data.mortgage_stamp_duty),
    mortgage_insurance_1: toNumber(data.mortgage_insurance_1),
    stamp_duty_mi_1: toNumber(data.stamp_duty_mi_1),
    mortgage_insurance_2: toNumber(data.mortgage_insurance_2),
    stamp_duty_mi_2: toNumber(data.stamp_duty_mi_2),
    loan_app_fee: toNumber(data.loan_app_fee),
    valuation_fee: toNumber(data.valuation_fee),
    search_fees: toNumber(data.search_fees),
    registration_mortgage: toNumber(data.registration_mortgage),
    lmiRequired: !!data.lmiRequired,
    wage_growth: toNumber(data.wage_growth),
    owners: data.owners.map((o: any) => ({
      name: o.name,
      ownership: toNumber(o.ownership),
      income: toNumber(o.income),
    })),
  }

  const res = await fetch("http://localhost:5000/api/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transformed),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error("❌ Backend rejected:", error)
    throw new Error("Failed to create property")
  }

  return await res.json()
}


