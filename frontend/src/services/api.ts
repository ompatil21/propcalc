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

// Property CRUD


// Fetch all properties
export async function getProperties() {
  const res = await fetch('http://localhost:5000/api/properties', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

// Fetch property by ID
export async function getPropertyById(id: string) {
  const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch property');
  return res.json();
}

// Update property by ID
export async function updateProperty(id: string, propertyData: any) {
  const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (!res.ok) throw new Error('Failed to update property');
  return res.json();
}

// Delete property by ID
export async function deleteProperty(id: string) {
  const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to delete property');
  return res.json();
}


// Simulation APIs
const SIMULATION_BASE_URL = "http://localhost:5000/api/simulation";

export async function runSimulation(scenarios: any[]) {
  const res = await fetch(SIMULATION_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarios }),
  });
  if (!res.ok) throw new Error("Failed to run simulation");
  return await res.json();
}


export async function simulateProperty(data: any) {
  const res = await fetch('http://localhost:5000/api/simulation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch simulation results');
  return res.json();
}

export async function getSimulationGrowth(data: any) {
  const res = await fetch('http://localhost:5000/api/simulation/growth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch simulation growth');
  return res.json();
}

export async function getSimulationCashFlow(data: any) {
  const res = await fetch('http://localhost:5000/api/simulation/cashflow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch simulation cash flow');
  return res.json();
}

export async function getSimulationCumulativeCashFlow(data: any) {
  const res = await fetch('http://localhost:5000/api/simulation/cumulative-cashflow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch cumulative cash flow');
  return res.json();
}

// src/services/api.ts
const BASE = "http://localhost:5000/api/tax-calc";


export async function calculateTax(data: any) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();  // raw error string
  console.log("🔍 Raw API response:", text);  // logs {"error": "..."}
  
  if (!res.ok) throw new Error("Failed to calculate tax");
  return JSON.parse(text);
}



export async function getTaxDeductions(data: any) {
  const res = await fetch(`${BASE}/deductions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get deductions");
  return await res.json();
}

export async function getTaxHoldingCosts(data: any) {
  const res = await fetch(`${BASE}/holding-costs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get holding costs");
  return await res.json();
}

export async function getTaxHoldingCostsYears(data: any) {
  const res = await fetch(`${BASE}/holding-costs-years`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get holding costs by year");
  return await res.json();
}

export async function getTaxYearlyData(data: any) {
  const res = await fetch(`${BASE}/yearly-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get yearly data");
  return await res.json();
}



// Portfolio APIs
export async function getPortfolioOverview(data: any) {
  const res = await fetch('http://localhost:5000/api/portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch portfolio overview');
  return res.json();
}

export async function getPortfolioGrowth(data: any) {
  const res = await fetch('http://localhost:5000/api/portfolio/growth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch portfolio growth');
  return res.json();
}

export async function getPortfolioCashFlow(data: any) {
  const res = await fetch('http://localhost:5000/api/portfolio/cashflow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch portfolio cash flow');
  return res.json();
}

export async function getPortfolioSummary(data: any) {
  const res = await fetch('http://localhost:5000/api/portfolio/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to fetch portfolio summary');
  return res.json();
}

