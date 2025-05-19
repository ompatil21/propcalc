'use client';

import { useState } from "react";
import { runSimulation } from "@/services/api";
import { LoadingOverlay } from "@/components/ui/spinner";
import { Bar, Line } from 'react-chartjs-2';
import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS, ChartData, ChartOptions, Legend,
  LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend
);

const defaultScenario = {
  label: "Scenario 1",
  propertyState: '',
  purchasePrice: '',
  salePrice: '',
  holdingYears: '',
  growthRate: '3',
  rentalGrowth: '3.5',
  annualRentIncome: '',
  mortgageInterest: '',
  propertyExpenses: '',
  propertyTaxes: '',
  depreciationBuilding: '',
  depreciationFittings: '',
  loanAmount1: '',
  interestRate1: '3.7',
  owners: [
    { name: "Owner 1", ownership_percent: 100, income: "" }
  ]
};

export default function SimulatorPage() {
  const [scenarios, setScenarios] = useState([ { ...defaultScenario } ]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Handlers for scenario editing
  const handleScenarioChange = (idx: number, field: string, value: string) => {
    setScenarios(prev =>
      prev.map((sc, i) => i === idx ? { ...sc, [field]: value } : sc)
    );
  };

  const handleOwnerChange = (scIdx: number, ownerIdx: number, field: string, value: string) => {
    setScenarios(prev =>
      prev.map((sc, i) =>
        i === scIdx
          ? { ...sc, owners: sc.owners.map((o, j) => j === ownerIdx ? { ...o, [field]: value } : o) }
          : sc
      )
    );
  };

  const addScenario = () => setScenarios(prev => [
    ...prev,
    { ...defaultScenario, label: `Scenario ${prev.length + 1}` }
  ]);
  const removeScenario = (idx: number) => setScenarios(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));

  const addOwner = (scIdx: number) => setScenarios(prev =>
    prev.map((sc, i) =>
      i === scIdx
        ? { ...sc, owners: [...sc.owners, { name: `Owner ${sc.owners.length + 1}`, ownership_percent: 0, income: "" }] }
        : sc
    )
  );
  const removeOwner = (scIdx: number, ownerIdx: number) => setScenarios(prev =>
    prev.map((sc, i) =>
      i === scIdx
        ? { ...sc, owners: sc.owners.length === 1 ? sc.owners : sc.owners.filter((_, j) => j !== ownerIdx) }
        : sc
    )
  );

  // Submit all scenarios for simulation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = scenarios.map(sc => ({
        label: sc.label,
        property_state: sc.propertyState,
        purchase_price: parseFloat(sc.purchasePrice),
        sale_price: parseFloat(sc.salePrice),
        holding_years: parseInt(sc.holdingYears, 10),
        growth_rate: parseFloat(sc.growthRate),
        rental_growth: parseFloat(sc.rentalGrowth) / 100,
        annual_rent_income: parseFloat(sc.annualRentIncome),
        loan_amount_1: parseFloat(sc.loanAmount1),
        interest_rate_1: parseFloat(sc.interestRate1) / 100,
        expenses: {
          mortgage_interest: parseFloat(sc.mortgageInterest),
          property_expenses: parseFloat(sc.propertyExpenses),
          property_taxes: parseFloat(sc.propertyTaxes),
          depreciation_building: parseFloat(sc.depreciationBuilding),
          depreciation_fittings: parseFloat(sc.depreciationFittings),
        },
        owners: sc.owners.map(o => ({
          name: o.name,
          ownership_percent: parseFloat(o.ownership_percent as any) || 0,
          income: parseFloat(o.income as any) || 0
        })).filter(o => o.ownership_percent > 0)
      }));

      const simResult = await runSimulation(payload);
      setResults(simResult.scenarios);
      setShowResults(true);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Chart Data for Comparison ---
  const comparisonChartData = (() => {
    if (!showResults || !results.length) return null;
    const years = results[0].result.yearlyData.map((d: any) => d.year.toString());
    // Example: compare property value over time for each scenario
    const propertyValueData: ChartData<'line'> = {
      labels: years,
      datasets: results.map((sc, idx) => ({
        label: sc.label,
        data: sc.result.yearlyData.map((d: any) => d.propertyValue),
        borderColor: ['#2563eb', '#10b981', '#a21caf', '#f59e42'][idx % 4],
        backgroundColor: 'transparent'
      }))
    };
    // Example: compare after-tax cash flow (sum of all owners) for each scenario
    const afterTaxCashFlowData: ChartData<'line'> = {
      labels: years,
      datasets: results.map((sc, idx) => ({
        label: sc.label,
        data: sc.result.yearlyData.map((d: any) =>
          d.owners.reduce((sum: number, o: any) => sum + (o.after_tax_cash_flow_yearly || 0), 0)
        ),
        borderColor: ['#2563eb', '#10b981', '#a21caf', '#f59e42'][idx % 4],
        backgroundColor: 'transparent'
      }))
    };
    return { propertyValueData, afterTaxCashFlowData };
  })();

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      {isLoading && <LoadingOverlay />}
      <h1 className="text-4xl font-extrabold mb-2 text-primary tracking-tight">Property Investment Simulator</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300 text-lg">
        Compare multiple property investment scenarios side by side. Adjust variables to see the impact on returns, cash flow, and tax.
      </p>
      <form onSubmit={handleSubmit} className="space-y-10">
        {scenarios.map((sc, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800 mb-6">
            <div className="flex items-center justify-between mb-4">
              <input
                className="text-xl font-semibold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none w-1/2"
                value={sc.label}
                onChange={e => handleScenarioChange(idx, "label", e.target.value)}
                placeholder={`Scenario ${idx + 1}`}
              />
              <button type="button" className="btn-secondary" onClick={() => removeScenario(idx)} disabled={scenarios.length === 1}>Remove</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
              label="State of Purchase"
              name="propertyState"
              value={sc.propertyState}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleScenarioChange(idx, "propertyState", e.target.value)}
              options={['VIC','NSW','QLD','WA','SA','TAS','ACT','NT']}
              required
              />
              <InputField
              label="Purchase Price ($)"
              name="purchasePrice"
              type="number"
              value={sc.purchasePrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "purchasePrice", e.target.value)}
              required
              />
              <InputField
              label="Sale Price ($)"
              name="salePrice"
              type="number"
              value={sc.salePrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "salePrice", e.target.value)}
              required
              />
              <InputField
              label="Holding Years"
              name="holdingYears"
              type="number"
              value={sc.holdingYears}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "holdingYears", e.target.value)}
              required
              />
              <InputField
              label="Capital Growth Rate (%)"
              name="growthRate"
              type="number"
              value={sc.growthRate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "growthRate", e.target.value)}
              required
              />
              <InputField
              label="Rental Growth Rate (%)"
              name="rentalGrowth"
              type="number"
              value={sc.rentalGrowth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "rentalGrowth", e.target.value)}
              required
              />
              <InputField
              label="Annual Rental Income ($)"
              name="annualRentIncome"
              type="number"
              value={sc.annualRentIncome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "annualRentIncome", e.target.value)}
              required
              />
              <InputField
              label="Loan Amount 1 ($)"
              name="loanAmount1"
              type="number"
              value={sc.loanAmount1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "loanAmount1", e.target.value)}
              />
              <InputField
              label="Interest Rate 1 (%)"
              name="interestRate1"
              type="number"
              value={sc.interestRate1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "interestRate1", e.target.value)}
              />
              <InputField
              label="Mortgage Interest ($)"
              name="mortgageInterest"
              type="number"
              value={sc.mortgageInterest}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "mortgageInterest", e.target.value)}
              />
              <InputField
              label="Property Expenses ($)"
              name="propertyExpenses"
              type="number"
              value={sc.propertyExpenses}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "propertyExpenses", e.target.value)}
              />
              <InputField
              label="Property Taxes ($)"
              name="propertyTaxes"
              type="number"
              value={sc.propertyTaxes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "propertyTaxes", e.target.value)}
              />
              <InputField
              label="Depreciation Building ($)"
              name="depreciationBuilding"
              type="number"
              value={sc.depreciationBuilding}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "depreciationBuilding", e.target.value)}
              />
              <InputField
              label="Depreciation Fittings ($)"
              name="depreciationFittings"
              type="number"
              value={sc.depreciationFittings}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleScenarioChange(idx, "depreciationFittings", e.target.value)}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-2">Owners</h3>
              <div className="space-y-4">
                {sc.owners.map((owner, ownerIdx) => (
                    <div key={ownerIdx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <InputField
                      label="Name"
                      name="name"
                      type="text"
                      value={owner.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOwnerChange(idx, ownerIdx, "name", e.target.value)}
                      required
                    />
                    <InputField
                      label="Ownership (%)"
                      name="ownership_percent"
                      type="number"
                      value={owner.ownership_percent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOwnerChange(idx, ownerIdx, "ownership_percent", e.target.value)}
                      required
                    />
                    <InputField
                      label="Annual Income ($)"
                      name="income"
                      type="number"
                      value={owner.income}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOwnerChange(idx, ownerIdx, "income", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn-secondary mt-1"
                      onClick={() => removeOwner(idx, ownerIdx)}
                      disabled={sc.owners.length === 1}
                    >
                      Remove
                    </button>
                    </div>
                ))}
                <button type="button" className="btn-primary" onClick={() => addOwner(idx)}>Add Owner</button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn-primary" onClick={addScenario}>Add Scenario</button>
        <button type="submit" className="btn-primary mt-6 w-full py-3 text-lg font-semibold rounded-lg shadow hover:shadow-lg transition">
          Run Simulation
        </button>
      </form>

      {showResults && results.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-8 mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Scenario Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.map((sc, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="text-lg font-semibold mb-2">{sc.label}</div>
                <div className="grid grid-cols-1 gap-2">
                  <div>Stamp Duty: <span className="font-bold text-primary">${sc.result.stampDuty?.toLocaleString()}</span></div>
                  <div>Total Deductions: <span className="font-bold text-primary">${sc.result.totalDeductions?.toLocaleString()}</span></div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold">Owners</h4>
                  {sc.result.owners.map((owner: any, ownerIdx: number) => (
                    <div key={ownerIdx} className="text-sm mb-2">
                      <span className="font-bold">{owner.name} ({owner.ownership_percent}%)</span>: After-Tax Cash Flow (Yearly): <span className="text-primary">${owner.after_tax_cash_flow_yearly?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold mt-8 mb-4">Scenario Comparison Charts</h3>
          {comparisonChartData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CardSection>
                <Line data={comparisonChartData.propertyValueData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                <p className="text-center text-sm text-gray-500 mt-2">Property Value Over Time</p>
              </CardSection>
              <CardSection>
                <Line data={comparisonChartData.afterTaxCashFlowData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                <p className="text-center text-sm text-gray-500 mt-2">Total After-Tax Cash Flow (Yearly)</p>
              </CardSection>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function InputField({ label, name, type, value, onChange, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} className="input w-full" required={required} />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className="input w-full" required={required}>
        <option value="">Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function CardSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center">
      {children}
    </div>
  );
}
