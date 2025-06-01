'use client';

import { useState, useEffect } from "react";
import { calculateTax } from "@/services/api";
import { LoadingOverlay } from "@/components/ui/spinner";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  BarElement, CategoryScale, Chart as ChartJS, ChartData, ChartOptions, Legend,
  LinearScale, LineElement, PointElement, Title, Tooltip, ArcElement
} from "chart.js";
import { useSearchParams } from 'next/navigation';
import { getPropertyById } from '@/services/api';
import { Calculator, DollarSign, Users, Plus, Minus, Home, Building2, Receipt, TrendingUp, Sparkles } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

type Owner = {
  name: string;
  ownership: string;
  income: string;
};

// Enhanced Input Field Component
const InputField = ({ label, name, type, value, onChange, required = false, placeholder, min, max }: any) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
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
      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
    />
  </div>
);

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

  const searchParams = useSearchParams();
  const prefillId = searchParams.get("prefill");

  function convertToFormData(p: any) {
    return {
      state: p.state || "VIC",
      dateOfPurchase: p.date_of_purchase || "",
      dateOfSale: p.date_of_sale || "",
      holdingYears: p.holding_years?.toString() || "10",
      rentPerWeek: p.rentPerWeek?.toString() || "",
      weeksRented: p.weeksRented?.toString() || "50",
      interestLoan1: p.interestLoan1?.toString() || "",
      interestLoan2: p.interestLoan2?.toString() || "",
      interestRate: p.interest_rate?.toString() || "0.037",
      propertyManager: p.property_manager?.toString() || "7",
      lettingFeeWeeks: p.lettingFeeWeeks?.toString() || "1",
      insurance: p.insurance?.toString() || "",
      maintenance: p.maintenance?.toString() || "",
      strata: p.strata?.toString() || "",
      waterCharges: p.water?.toString() || "",
      cleaning: p.cleaning?.toString() || "",
      councilRates: p.council_rates?.toString() || "",
      gardening: p.gardening?.toString() || "",
      landTax: p.land_tax?.toString() || "",
      legalExpenses: p.legal_expenses?.toString() || "",
      pestControl: p.pest_control?.toString() || "",
      bookkeeping: p.bookkeeping?.toString() || "",
      postage: p.postage?.toString() || "",
      taxRelatedExpenses: p.tax_related_expenses?.toString() || "",
      travel: p.travel?.toString() || "",
      onceOffExpenses: p.once_off_expenses?.toString() || "",
      borrowingCosts: p.borrowing_costs?.toString() || "",
      depreciationBuildings: p.buildings_value?.toString() || "",
      depreciationFittings: p.fittings_value?.toString() || "",
      wageGrowth: p.wage_growth?.toString() || "0.02",
      rentalGrowth: p.rental_growth?.toString() || "0.035",
      inflation: p.inflation?.toString() || "0.025",
      capitalGrowth: p.capital_growth_rate?.toString() || "0.08",
      hasPrivateHealthCover: p.medicare_surcharge || false,
      purchase_price: p.purchase_price?.toString() || "",
      sale_price: p.sale_price?.toString() || "",
      owners: Array.isArray(p.owners)
        ? p.owners.map((o: any) => ({
          name: o.name || "",
          ownership: o.ownership?.toString() || "0",
          income: o.income?.toString() || "0",
        }))
        : [{ name: "Owner 1", ownership: "50", income: "" }],
    };
  }

  useEffect(() => {
    const fetchPrefill = async () => {
      if (prefillId) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:5000/api/properties/${prefillId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("🚀 Prefill Data:", data);
        setFormData(convertToFormData(data));
      }
    };
    fetchPrefill();
  }, [prefillId]);

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
      const payload: { [key: string]: any } = {
        ...formData,
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
        if (
          typeof payload[key] === "string" &&
          payload[key].trim() === "" &&
          !["dateOfPurchase", "dateOfSale", "state"].includes(key)
        ) {
          payload[key] = 0;
        }

        if (
          (key === "dateOfPurchase" || key === "dateOfSale") &&
          payload[key].trim?.() === ""
        ) {
          payload[key] = null;
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

  // Update the chartData definition to properly map owner values
  const chartData = validOwnerCount ? {
    labels: taxResults.yearly.map((y: any) => `Year ${y.year}`),
    datasets: formData.owners.map((owner: any, idx: number) => ({
      label: owner.name,
      data: taxResults.yearly.map((y: any) =>
        y.owners[idx]?.after_tax_cash_flow || 0
      ),
      backgroundColor: ["#2563eb", "#10b981", "#a21caf", "#f59e42"][idx % 4],
      borderColor: ["#2563eb", "#10b981", "#a21caf", "#f59e42"][idx % 4],
      type: "bar" as const,
    }))
  } : undefined;

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

  // Define holdingCostsBarData for chart rendering
  const holdingCostsBarData = taxResults?.holdingCosts
    ? safeBarData(
      taxResults.holdingCosts.labels,
      taxResults.holdingCosts.data,
      "Holding Costs",
      "#2563eb"
    )
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {isLoading && <LoadingOverlay />}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white opacity-5 rounded-full animate-pulse delay-75"></div>
          <div className="absolute top-40 right-40 w-16 h-16 bg-white opacity-5 rounded-full animate-pulse delay-150"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-white/20 rounded-2xl backdrop-blur-sm shadow-2xl border border-white/10">
                <Calculator className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Property Tax Calculator
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-8">
              Calculate your property investment returns, tax implications, and cash flow projections with professional accuracy
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Sparkles className="h-5 w-5 mr-2" />
                Australian Tax Compliant
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <TrendingUp className="h-5 w-5 mr-2" />
                Multi-Year Projections
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Users className="h-5 w-5 mr-2" />
                Multiple Owners Support
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-16">
          <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 px-8 py-8 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl mr-4">
                <Home className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Property Investment Calculator</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Enter your investment property information for detailed tax analysis</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-12">
            {/* Essential Fields */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-6">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Essential Property Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField label="State" name="state" type="text" value={formData.state} onChange={handleInputChange} required placeholder="e.g. VIC" />
                <InputField label="Date of Purchase" name="dateOfPurchase" type="date" value={formData.dateOfPurchase} onChange={handleInputChange} required />
                <InputField label="Holding Years" name="holdingYears" type="number" min={1} max={15} value={formData.holdingYears} onChange={handleInputChange} required placeholder="e.g. 10 (max 15)" />
                <InputField label="Purchase Price ($)" name="purchase_price" type="number" value={formData.purchase_price} onChange={handleInputChange} required placeholder="e.g. 400000" />
                <InputField label="Sale Price ($)" name="sale_price" type="number" value={formData.sale_price} onChange={handleInputChange} required placeholder="e.g. 650000" />
                <InputField label="Rent Per Week ($)" name="rentPerWeek" type="number" value={formData.rentPerWeek} onChange={handleInputChange} required placeholder="e.g. 330" />
                <InputField label="Weeks Rented Per Year" name="weeksRented" type="number" value={formData.weeksRented} onChange={handleInputChange} required placeholder="e.g. 50" />
                <InputField label="Property Management (%)" name="propertyManager" type="number" value={formData.propertyManager} onChange={handleInputChange} required placeholder="e.g. 7" />
                <InputField label="Letting Fee (weeks)" name="lettingFeeWeeks" type="number" value={formData.lettingFeeWeeks} onChange={handleInputChange} required placeholder="e.g. 1" />
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-700">
              <div className="flex items-center mb-6">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Financial & Expense Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField label="Date of Sale (optional)" name="dateOfSale" type="date" value={formData.dateOfSale} onChange={handleInputChange} placeholder="Leave blank for today" />
                <InputField label="Interest Loan 1 ($/yr) (optional)" name="interestLoan1" type="number" value={formData.interestLoan1} onChange={handleInputChange} placeholder="e.g. 13500" />
                <InputField label="Interest Loan 2 ($/yr) (optional)" name="interestLoan2" type="number" value={formData.interestLoan2} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Interest Rate (optional)" name="interestRate" type="number" value={formData.interestRate} onChange={handleInputChange} placeholder="e.g. 0.037" />
                <InputField label="Insurance ($/yr) (optional)" name="insurance" type="number" value={formData.insurance} onChange={handleInputChange} placeholder="e.g. 1000" />
                <InputField label="Maintenance ($/yr) (optional)" name="maintenance" type="number" value={formData.maintenance} onChange={handleInputChange} placeholder="e.g. 500" />
                <InputField label="Strata ($/yr) (optional)" name="strata" type="number" value={formData.strata} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Water Charges ($/yr) (optional)" name="waterCharges" type="number" value={formData.waterCharges} onChange={handleInputChange} placeholder="e.g. 600" />
                <InputField label="Cleaning ($/yr) (optional)" name="cleaning" type="number" value={formData.cleaning} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Council Rates ($/yr) (optional)" name="councilRates" type="number" value={formData.councilRates} onChange={handleInputChange} placeholder="e.g. 1600" />
                <InputField label="Gardening/Mowing ($/yr) (optional)" name="gardening" type="number" value={formData.gardening} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Land Tax ($/yr) (optional)" name="landTax" type="number" value={formData.landTax} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Legal Expenses ($/yr) (optional)" name="legalExpenses" type="number" value={formData.legalExpenses} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Pest Control ($/yr) (optional)" name="pestControl" type="number" value={formData.pestControl} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Bookkeeping ($/yr) (optional)" name="bookkeeping" type="number" value={formData.bookkeeping} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Postage and Stationery ($/yr) (optional)" name="postage" type="number" value={formData.postage} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Tax Related Expenses ($/yr) (optional)" name="taxRelatedExpenses" type="number" value={formData.taxRelatedExpenses} onChange={handleInputChange} placeholder="e.g. 574.75" />
                <InputField label="Travel and Car Expenses ($/yr) (optional)" name="travel" type="number" value={formData.travel} onChange={handleInputChange} placeholder="e.g. 0" />
                <InputField label="Once Off Expenses ($) (optional)" name="onceOffExpenses" type="number" value={formData.onceOffExpenses} onChange={handleInputChange} placeholder="e.g. 50" />
                <InputField label="Borrowing Costs ($) (optional)" name="borrowingCosts" type="number" value={formData.borrowingCosts} onChange={handleInputChange} placeholder="e.g. 1810" />
                <InputField label="Depreciation - Buildings ($/yr) (optional)" name="depreciationBuildings" type="number" value={formData.depreciationBuildings} onChange={handleInputChange} placeholder="e.g. 3000" />
                <InputField label="Depreciation - Fittings ($ initial) (optional)" name="depreciationFittings" type="number" value={formData.depreciationFittings} onChange={handleInputChange} placeholder="e.g. 5000" />
                <InputField label="Wage Growth Rate (optional)" name="wageGrowth" type="number" value={formData.wageGrowth} onChange={handleInputChange} placeholder="e.g. 0.02" />
                <InputField label="Rental Growth Rate (optional)" name="rentalGrowth" type="number" value={formData.rentalGrowth} onChange={handleInputChange} placeholder="e.g. 0.035" />
                <InputField label="Inflation Rate (optional)" name="inflation" type="number" value={formData.inflation} onChange={handleInputChange} placeholder="e.g. 0.025" />
                <InputField label="Capital Growth Rate (optional)" name="capitalGrowth" type="number" value={formData.capitalGrowth} onChange={handleInputChange} placeholder="e.g. 0.08" />
              </div>

              {/* Health Cover Checkbox */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-blue-200 dark:border-gray-600">
                <div className="flex items-center">
                  <input
                    id="hasPrivateHealthCover"
                    name="hasPrivateHealthCover"
                    type="checkbox"
                    checked={formData.hasPrivateHealthCover}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="hasPrivateHealthCover" className="ml-4 text-gray-700 dark:text-gray-300 font-semibold">
                    Has Private Health Cover
                    <span className="block text-sm text-gray-500 dark:text-gray-400 font-normal">(Medicare surcharge exemption)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Owners Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Property Owners</h3>
              </div>
              <div className="space-y-6">
                {formData.owners.map((owner: Owner, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">Owner {idx + 1}</h4>
                      {formData.owners.length > 1 && (
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-400 rounded-xl transition-colors font-medium"
                          onClick={() => removeOwner(idx)}
                        >
                          <Minus className="h-4 w-4 mr-2" />
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="Name"
                        name={`owner_name_${idx}`}
                        type="text"
                        value={owner.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOwnerChange(idx, 'name', e.target.value)}
                        required
                        placeholder="e.g. John"
                      />
                      <InputField
                        label="Ownership (%)"
                        name={`owner_ownership_${idx}`}
                        type="number"
                        value={owner.ownership}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOwnerChange(idx, 'ownership', e.target.value)}
                        required
                        placeholder="e.g. 50"
                      />
                      <InputField
                        label="Annual Income ($)"
                        name={`owner_income_${idx}`}
                        type="number"
                        value={owner.income}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOwnerChange(idx, 'income', e.target.value)}
                        required
                        placeholder="e.g. 120000"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center justify-center w-full p-4 bg-white dark:bg-gray-800 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-2xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  onClick={addOwner}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Owner
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-blue-500/30"
              >
                <Calculator className="h-7 w-7 mr-3" />
                Calculate Tax Analysis
              </button>
            </div>
          </form>
        </div>

        {/* Results Section - Keep all existing chart logic exactly the same */}
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
                          <td className="px-2 py-1 text-right">${year.pre_tax_cash_flow_week?.toLocaleString?.(undefined, { maximumFractionDigits: 2 }) ?? 0}</td>
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
                    {taxResults.state_reference?.owner_portions?.map((portion: any, idx: number) => (
                      <p key={idx}>
                        Owner {idx + 1}: ${portion.toLocaleString()}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Charts Section - keep all existing chart logic */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Deduction Breakdown */}
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Deduction Breakdown</h3>
                    <Bar
                      data={safeBarData(
                        taxResults?.deductions?.labels,
                        taxResults?.deductions?.data,
                        "Deductions",
                        "#10b981"
                      )}
                      options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }}
                    />
                  </div>

                  {/* Holding Costs Breakdown (Bar) */}
                  {holdingCostsBarData && (
                    <div style={{ maxWidth: 500, height: 320 }}>
                      <h3 className="font-bold mb-2">Holding Costs Breakdown</h3>
                      <Bar
                        data={holdingCostsBarData}
                        options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }}
                      />
                    </div>
                  )}

                  {/* Total Profit Per Year */}
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Total Profit Per Year</h3>
                    <Bar
                      data={safeBarData(
                        taxResults?.yearly?.map((y: any) => `Year ${y.year}`),
                        taxResults?.total_profit_per_year,
                        "Total Profit Per Year",
                        "#a21caf"
                      )}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>

                  {/* Cumulative Cash Flow */}
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Cumulative Cash Flow</h3>
                    <Line
                      data={safeLineData(
                        taxResults?.yearly?.map((y: any) => `Year ${y.year}`),
                        taxResults?.cumulative_cash_flow,
                        "Cumulative Cash Flow",
                        "#10b981",
                        "rgba(16,185,129,0.2)"
                      )}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>

                  {/* Cumulative Profit */}
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Cumulative Profit</h3>
                    <Line
                      data={safeLineData(
                        taxResults?.yearly?.map((y: any) => `Year ${y.year}`),
                        taxResults?.cumulative_profit,
                        "Cumulative Profit",
                        "#f59e42",
                        "rgba(245,158,66,0.2)"
                      )}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>

                  {/* Holding Costs Yearly Breakdown */}
                  <div style={{ maxWidth: 500, height: 320 }}>
                    <h3 className="font-bold mb-2">Holding Costs by Year</h3>
                    <Bar
                      data={{
                        labels: taxResults?.holdingCostsYears?.[0]?.labels || [],
                        datasets: taxResults?.holdingCostsYears?.map((yearData: any, idx: number) => ({
                          label: `Year ${idx + 1}`,
                          data: yearData.data,
                          backgroundColor: [
                            '#2563eb',
                            '#10b981',
                            '#a21caf',
                            '#f59e42',
                            '#6366f1',
                            '#ec4899'
                          ][idx % 6],
                        })) || []
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            stacked: false
                          },
                          y: {
                            stacked: false
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Property Value Over Time */}
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
              </div>
            ) : (
              <div className="w-full max-w-7xl mx-auto py-8">
                <p className="text-red-500">
                  Error: Owner count mismatch. Please refresh and try again.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}