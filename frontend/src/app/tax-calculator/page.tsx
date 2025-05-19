'use client';

import { useState, useEffect } from "react";
import { calculateTax } from "@/services/api";
import { LoadingOverlay } from "@/components/ui/spinner";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  BarElement, CategoryScale, Chart as ChartJS, ChartData, ChartOptions, Legend,
  LinearScale, LineElement, PointElement, Title, Tooltip, ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

type Owner = {
  name: string;
  ownership: string;
  income: string;
};

export default function TaxCalculatorPage({ prefillData }: { prefillData?: any }) {
  const [formData, setFormData] = useState(() => ({
    dateOfPurchase: prefillData?.dateOfPurchase || "",
    dateOfSale: prefillData?.dateOfSale || "",
    state: prefillData?.state || "VIC",
    holdingYears: prefillData?.holdingYears?.toString() || "10",
    rentPerWeek: prefillData?.rentPerWeek?.toString() || "",
    weeksRented: prefillData?.weeksRented?.toString() || "50",
    interestLoan1: prefillData?.interestLoan1?.toString() || "",
    interestLoan2: prefillData?.interestLoan2?.toString() || "",
    interestRate: prefillData?.interestRate?.toString() || "0.037",
    propertyManager: prefillData?.propertyManager?.toString() || "7",
    lettingFeeWeeks: prefillData?.lettingFeeWeeks?.toString() || "1",
    insurance: prefillData?.insurance?.toString() || "",
    maintenance: prefillData?.maintenance?.toString() || "",
    strata: prefillData?.strata?.toString() || "",
    waterCharges: prefillData?.waterCharges?.toString() || "",
    cleaning: prefillData?.cleaning?.toString() || "",
    councilRates: prefillData?.councilRates?.toString() || "",
    gardening: prefillData?.gardening?.toString() || "",
    landTax: prefillData?.landTax?.toString() || "",
    legalExpenses: prefillData?.legalExpenses?.toString() || "",
    pestControl: prefillData?.pestControl?.toString() || "",
    bookkeeping: prefillData?.bookkeeping?.toString() || "",
    postage: prefillData?.postage?.toString() || "",
    taxRelatedExpenses: prefillData?.taxRelatedExpenses?.toString() || "",
    travel: prefillData?.travel?.toString() || "",
    onceOffExpenses: prefillData?.onceOffExpenses?.toString() || "",
    borrowingCosts: prefillData?.borrowingCosts?.toString() || "",
    depreciationBuildings: prefillData?.depreciationBuildings?.toString() || "",
    depreciationFittings: prefillData?.depreciationFittings?.toString() || "",
    wageGrowth: prefillData?.wageGrowth?.toString() || "0.02",
    rentalGrowth: prefillData?.rentalGrowth?.toString() || "0.035",
    inflation: prefillData?.inflation?.toString() || "0.025",
    capitalGrowth: prefillData?.capitalGrowth?.toString() || "0.08",
    hasPrivateHealthCover: prefillData?.hasPrivateHealthCover || false,
    purchase_price: prefillData?.purchase_price?.toString() || "",
    sale_price: prefillData?.sale_price?.toString() || "",
    owners: prefillData?.owners?.map((o: any) => ({
      name: o.name || "",
      ownership: o.ownership?.toString() || "",
      income: o.income?.toString() || "",
    })) || [{ name: "Owner 1", ownership: "50", income: "" }, { name: "Owner 2", ownership: "50", income: "" }],
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [taxResults, setTaxResults] = useState<any>(null);

  // Clear taxResults if number of owners changes
  useEffect(() => {
    setTaxResults(null);
  }, [formData.owners.length]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOwnerChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newOwners = [...prev.owners];
      newOwners[idx] = { ...newOwners[idx], [field]: value };
      return { ...prev, owners: newOwners };
    });
  };

  const addOwner = () => {
    setFormData((prev) => ({
      ...prev,
      owners: [
        ...prev.owners,
        { name: `Owner ${prev.owners.length + 1}`, ownership: "", income: "" },
      ],
    }));
  };

  const removeOwner = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      owners:
        prev.owners.length === 1
          ? prev.owners
          : prev.owners.filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: { [key: string]: any } = { ...formData, 
        wageGrowth: String(Number(formData.wageGrowth)),
        rentalGrowth: String(Number(formData.rentalGrowth)),
        inflation: String(Number(formData.inflation)),
        capitalGrowth: String(Number(formData.capitalGrowth)),
        owners: formData.owners.map((o: Owner) => ({
          name: o.name,
          ownership: Number(o.ownership),
          income: Number(o.income)
        }))
      };
      Object.keys(payload).forEach(key => {
        if (typeof payload[key] === "string" && payload[key].trim() === "" && key !== "dateOfPurchase" && key !== "dateOfSale" && key !== "state") {
          payload[key] = 0;
        }
      });
      const result = await calculateTax(payload);
      setTaxResults(result);
    } catch (error) {
      console.error("Tax calculation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Chart Data ---
  const validOwnerCount =
    taxResults &&
    Array.isArray(taxResults.yearly) &&
    taxResults.yearly.length > 0 &&
    formData.owners &&
    formData.owners.length > 0 &&
    taxResults.yearly.every(
      (y: any) =>
        Array.isArray(y.owners) && y.owners.length === formData.owners.length
    );

  const chartData =
    validOwnerCount
      ? {
          labels: taxResults.yearly.map((y: any) => `Year ${y.year}`),
          datasets: Array.isArray(taxResults.yearly[0]?.owners)
            ? taxResults.yearly[0].owners.map((owner: any, idx: number) => ({
                label: owner.name || `Owner ${idx + 1}`,
                data: taxResults.yearly.map(
                  (y: any) =>
                    (y.owners &&
                      y.owners[idx] &&
                      typeof y.owners[idx].after_tax_cash_flow === "number"
                      ? y.owners[idx].after_tax_cash_flow
                      : 0)
                ),
                backgroundColor: ["#2563eb", "#10b981", "#a21caf", "#f59e42"][idx % 4],
                borderColor: ["#2563eb", "#10b981", "#a21caf", "#f59e42"][idx % 4],
                type: "bar" as const,
              }))
            : [],
        }
      : undefined;

  // Defensive helpers for all chart data
  const safeBarData = (labels: any[] = [], data: any[] = [], label = "", color = "#2563eb") => ({
    labels: Array.isArray(labels) ? labels : [],
    datasets: [
      {
        label,
        data: Array.isArray(data) ? data : [],
        backgroundColor: color,
      },
    ],
  });

  const safePieData = (labels: any[] = [], data: any[] = [], colors: string[] = []) => ({
    labels: Array.isArray(labels) ? labels : [],
    datasets: [
      {
        data: Array.isArray(data) ? data : [],
        backgroundColor: colors.length ? colors : ["#2563eb", "#10b981", "#f59e42"],
      },
    ],
  });

  const safeLineData = (labels: any[] = [], data: any[] = [], label = "", color = "#10b981", bg = "rgba(16,185,129,0.2)") => ({
    labels: Array.isArray(labels) ? labels : [],
    datasets: [
      {
        label,
        data: Array.isArray(data) ? data : [],
        borderColor: color,
        backgroundColor: bg,
        fill: true,
      },
    ],
  });

  // Property Value Over Time calculation
  const propertyValues = [];
  let propertyValue = Number(formData.purchase_price) || 0;
  const capitalGrowth = Number(formData.capitalGrowth) || 0;
  const holdingYears = taxResults?.yearly?.length || 0;
  for (let i = 0; i < holdingYears; i++) {
    if (i === 0) {
      propertyValues.push(propertyValue);
    } else {
      propertyValue = propertyValue * (1 + capitalGrowth);
      propertyValues.push(Number(propertyValue.toFixed(2)));
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-2 md:px-0">
      {isLoading && <LoadingOverlay />}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2 text-primary tracking-tight text-center">Property Tax Calculator</h1>
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-200 max-w-3xl mx-auto text-center">
          This calculator helps you estimate your annual and long-term property investment performance in Australia.
          Enter your property and finance details below to see cash flow, deductions, after-tax results, and capital gains for each owner, along with visual breakdowns and projections.
        </p>
        <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="State" name="state" type="text" value={formData.state} onChange={handleInputChange} required placeholder="VIC/NSW/QLD/etc" />
            <InputField label="Date of Purchase" name="dateOfPurchase" type="date" value={formData.dateOfPurchase} onChange={handleInputChange} required placeholder="Select the purchase date" />
            <InputField label="Date of Sale" name="dateOfSale" type="date" value={formData.dateOfSale} onChange={handleInputChange} placeholder="Leave blank for today" />
            <InputField label="Holding Years" name="holdingYears" type="number" min={1} max={15} value={formData.holdingYears} onChange={handleInputChange} required placeholder="e.g. 10 (max 15)" />
            <InputField label="Purchase Price ($)" name="purchase_price" type="number" value={formData.purchase_price} onChange={handleInputChange} required placeholder="e.g. 400000" />
            <InputField label="Sale Price ($)" name="sale_price" type="number" value={formData.sale_price} onChange={handleInputChange} required placeholder="e.g. 650000" />
            <InputField label="Rent Per Week ($)" name="rentPerWeek" type="number" value={formData.rentPerWeek} onChange={handleInputChange} required placeholder="e.g. 330" />
            <InputField label="Weeks Rented Per Year" name="weeksRented" type="number" value={formData.weeksRented} onChange={handleInputChange} required placeholder="e.g. 50" />
            <InputField label="Interest Loan 1 ($/yr)" name="interestLoan1" type="number" value={formData.interestLoan1} onChange={handleInputChange} placeholder="e.g. 13500" />
            <InputField label="Interest Loan 2 ($/yr)" name="interestLoan2" type="number" value={formData.interestLoan2} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Interest Rate" name="interestRate" type="number" value={formData.interestRate} onChange={handleInputChange} placeholder="e.g. 0.037" />
            <InputField label="Property Management (%)" name="propertyManager" type="number" value={formData.propertyManager} onChange={handleInputChange} required placeholder="e.g. 7" />
            <InputField label="Letting Fee (weeks)" name="lettingFeeWeeks" type="number" value={formData.lettingFeeWeeks} onChange={handleInputChange} required placeholder="e.g. 1" />
            <InputField label="Insurance ($/yr)" name="insurance" type="number" value={formData.insurance} onChange={handleInputChange} placeholder="e.g. 1000" />
            <InputField label="Maintenance ($/yr)" name="maintenance" type="number" value={formData.maintenance} onChange={handleInputChange} placeholder="e.g. 500" />
            <InputField label="Strata ($/yr)" name="strata" type="number" value={formData.strata} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Water Charges ($/yr)" name="waterCharges" type="number" value={formData.waterCharges} onChange={handleInputChange} placeholder="e.g. 600" />
            <InputField label="Cleaning ($/yr)" name="cleaning" type="number" value={formData.cleaning} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Council Rates ($/yr)" name="councilRates" type="number" value={formData.councilRates} onChange={handleInputChange} placeholder="e.g. 1600" />
            <InputField label="Gardening/Mowing ($/yr)" name="gardening" type="number" value={formData.gardening} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Land Tax ($/yr)" name="landTax" type="number" value={formData.landTax} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Legal Expenses ($/yr)" name="legalExpenses" type="number" value={formData.legalExpenses} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Pest Control ($/yr)" name="pestControl" type="number" value={formData.pestControl} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Bookkeeping ($/yr)" name="bookkeeping" type="number" value={formData.bookkeeping} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Postage and Stationery ($/yr)" name="postage" type="number" value={formData.postage} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Tax Related Expenses ($/yr)" name="taxRelatedExpenses" type="number" value={formData.taxRelatedExpenses} onChange={handleInputChange} placeholder="e.g. 574.75" />
            <InputField label="Travel and Car Expenses ($/yr)" name="travel" type="number" value={formData.travel} onChange={handleInputChange} placeholder="e.g. 0" />
            <InputField label="Once Off Expenses ($)" name="onceOffExpenses" type="number" value={formData.onceOffExpenses} onChange={handleInputChange} placeholder="e.g. 50" />
            <InputField label="Borrowing Costs ($)" name="borrowingCosts" type="number" value={formData.borrowingCosts} onChange={handleInputChange} placeholder="e.g. 1810" />
            <InputField label="Depreciation - Buildings ($/yr)" name="depreciationBuildings" type="number" value={formData.depreciationBuildings} onChange={handleInputChange} placeholder="e.g. 3000" />
            <InputField label="Depreciation - Fittings ($ initial)" name="depreciationFittings" type="number" value={formData.depreciationFittings} onChange={handleInputChange} placeholder="e.g. 5000" />
            <InputField label="Wage Growth Rate" name="wageGrowth" type="number" value={formData.wageGrowth} onChange={handleInputChange} placeholder="e.g. 0.02" />
            <InputField label="Rental Growth Rate" name="rentalGrowth" type="number" value={formData.rentalGrowth} onChange={handleInputChange} placeholder="e.g. 0.035" />
            <InputField label="Inflation Rate" name="inflation" type="number" value={formData.inflation} onChange={handleInputChange} placeholder="e.g. 0.025" />
            <InputField label="Capital Growth Rate" name="capitalGrowth" type="number" value={formData.capitalGrowth} onChange={handleInputChange} placeholder="e.g. 0.08" />
            <div className="flex items-center space-x-2">
              <input id="hasPrivateHealthCover" name="hasPrivateHealthCover" type="checkbox" checked={formData.hasPrivateHealthCover} onChange={handleInputChange} />
              <label htmlFor="hasPrivateHealthCover" className="select-none">Has Private Health Cover</label>
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Owners</h2>
          <div className="space-y-2">
            {formData.owners.map((owner: Owner, idx: number) => (
              <div key={idx} className="flex flex-row gap-4 items-end">
                <InputField label="Name" name={`owner_name_${idx}`} type="text" value={owner.name} onChange={(e) => handleOwnerChange(idx, 'name', e.target.value)} required placeholder="e.g. John" />
                <InputField label="Ownership (%)" name={`owner_ownership_${idx}`} type="number" value={owner.ownership} onChange={(e) => handleOwnerChange(idx, 'ownership', e.target.value)} required placeholder="e.g. 50" />
                <InputField label="Annual Income ($)" name={`owner_income_${idx}`} type="number" value={owner.income} onChange={(e) => handleOwnerChange(idx, 'income', e.target.value)} required placeholder="e.g. 120000" />
                {formData.owners.length > 1 && (
                  <button type="button" className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={() => removeOwner(idx)}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-4 mt-2" onClick={addOwner}>Add Owner</button>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 px-6 mt-6 w-full text-lg transition">
            Calculate Tax
          </button>
        </form>

        {/* Results */}
        {taxResults && (
          <>
            {/* Defensive: Only render if owner count matches */}
            {Array.isArray(taxResults.yearly) &&
              taxResults.yearly.length > 0 &&
              Array.isArray(taxResults.yearly[0].owners) &&
              taxResults.yearly[0].owners.length === formData.owners.length ? (
              <div className="w-full max-w-7xl mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">Annual Calculation Breakdown</h2>
                <div className="mb-4">
                  <b>Days Owned:</b> {taxResults.days_owned}
                </div>
                <div className="mb-4">
                  <b>Stamp Duty:</b> ${taxResults.transfer_stamp_duty?.toLocaleString() ?? "0"}
                  <br />
                  <b>Mortgage Stamp Duty:</b> ${taxResults.mortgage_stamp_duty?.toLocaleString() ?? "0"}
                  <br />
                  <b>Upfront Costs:</b> ${taxResults.upfront_costs?.toLocaleString() ?? "0"}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th>Year</th>
                        <th>Total Rent</th>
                        <th>Total Expenses</th>
                        <th>Pre-Tax Cash Flow</th>
                        <th>Pre-Tax Cash Flow/Week</th>
                        <th>Cash Deductions</th>
                        <th>Borrowing Costs</th>
                        <th>Depreciation Buildings</th>
                        <th>Depreciation Fittings</th>
                        <th>Non-Cash Deductions</th>
                        <th>Claimable Deductions</th>
                        <th>Net Income</th>
                        <th>Total Profit</th>
                        <th>Cumulative Cash Flow</th>
                        <th>Cumulative Profit</th>
                        {Array.isArray(taxResults.yearly[0]?.owners) &&
                          taxResults.yearly[0].owners.map((owner: any, idx: number) => (
                            <th key={idx}>{owner.name} After-Tax Cash Flow</th>
                          ))}
                        {Array.isArray(taxResults.yearly[0]?.owners) &&
                          taxResults.yearly[0].owners.map((owner: any, idx: number) => (
                            <th key={`medicare-levy-${idx}`}>{owner.name} Medicare Levy</th>
                        ))}
                        {Array.isArray(taxResults.yearly[0]?.owners) &&
                          taxResults.yearly[0].owners.map((owner: any, idx: number) => (
                            <th key={`medicare-surcharge-${idx}`}>{owner.name} Medicare Surcharge</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(taxResults.yearly) && taxResults.yearly.map((year: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                          <td className="px-2 py-1 text-center">{year.year}</td>
                          <td className="px-2 py-1 text-right">${year.total_rent?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.total_expenses?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.pre_tax_cash_flow?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.pre_tax_cash_flow_week?.toLocaleString?.(undefined, {maximumFractionDigits: 2}) ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.total_cash_deductions?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.borrowing_costs_annual?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.dep_buildings?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.dep_fittings?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.total_non_cash_deductions?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.total_claimable_deductions?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.net_income?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.total_profit?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.cumulative_cash_flow?.toLocaleString?.() ?? 0}</td>
                          <td className="px-2 py-1 text-right">${year.cumulative_profit?.toLocaleString?.() ?? 0}</td>
                          {Array.isArray(year.owners) &&
                            year.owners.map((owner: any, i: number) => (
                              <td className="px-2 py-1 text-right" key={i}>${owner.after_tax_cash_flow?.toLocaleString?.() ?? 0}</td>
                            ))}
                          {Array.isArray(year.owners) &&
                            year.owners.map((owner: any, i: number) => (
                              <td className="px-2 py-1 text-right" key={`medicare-levy-${i}`}>${owner.medicare_levy?.toLocaleString?.() ?? 0}</td>
                            ))}
                          {Array.isArray(year.owners) &&
                            year.owners.map((owner: any, i: number) => (
                              <td className="px-2 py-1 text-right" key={`medicare-surcharge-${i}`}>${owner.medicare_surcharge?.toLocaleString?.() ?? 0}</td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h2 className="text-2xl font-bold mt-10 mb-4">State Reference (Sale)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p>Agent Commission: <b>${taxResults.state_reference?.agent_commission?.toLocaleString?.() ?? 0}</b></p>
                    <p>Sales Costs: <b>${taxResults.state_reference?.sales_costs?.toLocaleString?.() ?? 0}</b></p>
                    <p>Capital Gain: <b>${taxResults.state_reference?.capital_gain?.toLocaleString?.() ?? 0}</b></p>
                    <p>Building Depreciation Added: <b>${taxResults.state_reference?.building_depreciation_added?.toLocaleString?.() ?? 0}</b></p>
                    <p>Real Capital Gain: <b>${taxResults.state_reference?.real_capital_gain?.toLocaleString?.() ?? 0}</b></p>
                    <p>Taxable Capital Gain (50%): <b>${taxResults.state_reference?.taxable_capital_gain?.toLocaleString?.() ?? 0}</b></p>
                  </div>
                  <div>
                    <p>Owner Portions:</p>
                    <ul>
                      {Array.isArray(taxResults.state_reference?.owner_portions) && taxResults.state_reference.owner_portions.map((portion: number, idx: number) => (
                        <li key={idx}>{formData.owners[idx]?.name || `Owner ${idx+1}`}: <b>${portion?.toLocaleString?.() ?? 0}</b></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-10 mb-4">Charts & Breakdowns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Expense Breakdown</h3>
                    <Bar data={safeBarData(
                      taxResults?.deductions?.labels,
                      taxResults?.deductions?.data,
                      "Expenses",
                      "#2563eb"
                    )} options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                  </div>
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Deduction Breakdown</h3>
                    <Bar data={safeBarData(
                      taxResults?.deductions?.labels,
                      taxResults?.deductions?.data,
                      "Deductions",
                      "#10b981"
                    )} options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                  </div>
                  {taxResults?.holdingCosts && Array.isArray(taxResults.holdingCosts.labels) && Array.isArray(taxResults.holdingCosts.data) && (
                    <div style={{ maxWidth: 500, height: 320 }}>
                      <h3 className="font-bold mb-2">Holding Costs Breakdown</h3>
                      <Pie
                        data={safePieData(
                          taxResults.holdingCosts.labels,
                          taxResults.holdingCosts.data,
                          ["#2563eb", "#10b981", "#f59e42"]
                        )}
                        options={{ responsive: true, maintainAspectRatio: false }}
                      />
                    </div>
                  )}
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Total Profit Per Year</h3>
                    <Bar data={safeBarData(
                      taxResults?.yearly?.map((y: any) => `Year ${y.year}`),
                      taxResults?.total_profit_per_year,
                      "Total Profit Per Year",
                      "#a21caf"
                    )} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Cumulative Cash Flow</h3>
                    <Line data={safeLineData(
                      taxResults?.yearly?.map((y: any) => `Year ${y.year}`),
                      taxResults?.cumulative_cash_flow,
                      "Cumulative Cash Flow",
                      "#10b981",
                      "rgba(16,185,129,0.2)"
                    )} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Cumulative Profit</h3>
                    <Line data={safeLineData(
                      taxResults?.yearly?.map((y: any) => `Year ${y.year}`),
                      taxResults?.cumulative_profit,
                      "Cumulative Profit",
                      "#f59e42",
                      "rgba(245,158,66,0.2)"
                    )} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  {Array.isArray(taxResults.holdingCostsYears) && taxResults.holdingCostsYears.length > 0 && (
                    <div className="col-span-full">
                      <h3 className="font-bold mb-2">Holding Costs Breakdown (Yearly)</h3>
                      <div className="flex flex-wrap gap-6">
                        {taxResults.holdingCostsYears.map((hc: any, idx: number) => (
                          <div key={idx} style={{ width: 250, height: 250 }}>
                            <div className="text-center font-semibold mb-1">Year {hc.year}</div>
                            <Pie
                              data={{
                                labels: hc.labels,
                                datasets: [{
                                  data: hc.data,
                                  backgroundColor: ["#2563eb", "#10b981", "#f59e42"],
                                }]
                              }}
                              options={{ responsive: true, maintainAspectRatio: false }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Property Value Over Time</h3>
                    <Line
                      data={{
                        labels: taxResults?.yearly?.map((y: any) => `Year ${y.year}`),
                        datasets: [
                          {
                            label: "Estimated Property Value",
                            data: propertyValues,
                            borderColor: "#2563eb",
                            backgroundColor: "rgba(37,99,235,0.2)",
                            fill: true,
                          },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
                <div className="mt-10" style={{ maxWidth: 900, margin: "0 auto" }}>
                  {/*<h2 className="text-xl font-bold mb-4">After-tax Cash Flow Per Owner (Yearly)</h2>
                  {chartData && (
                    <Bar data={chartData as any} options={{ responsive: true, plugins: { legend: { position: 'top' } }, maintainAspectRatio: false, aspectRatio: 2.5 }} />
                  )}
                  */}
                </div>
              </div>
            ) : (
              <div className="text-red-600 font-bold mt-8">
                Owner count mismatch between your input and calculation result.<br />
                Please click <b>Calculate Tax</b> again after changing owners.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// --- Helper Components ---
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  required = false,
  placeholder = "",
  description = "",
  min,
  max,
}: {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className="input w-full"
      />
      {description && <div className="text-xs text-gray-500">{description}</div>}
    </div>
  );
}
