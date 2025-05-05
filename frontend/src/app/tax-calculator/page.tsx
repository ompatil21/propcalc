'use client';

import * as React from "react";
import { Calculator, ArrowRight, DownloadCloud } from "lucide-react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function TaxCalculatorPage() {
  const [formData, setFormData] = React.useState({
    taxYear: '',
    filingStatus: '',
    annualIncome: '',
    propertyValue: '',
    propertyType: '',
    rentalIncome: '',
    mortgageInterest: '',
    propertyExpenses: '',
    purchaseYear: ''
  });

  const [showResults, setShowResults] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Check for dark mode
  React.useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Optional: Add listener for theme changes if you have a theme toggle
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would calculate the results here
    setShowResults(true);
  };

  // Chart Data - Only created when showResults is true
  const generateChartData = () => {
    // We would use actual calculated data here based on the form inputs
    
    // Base colors that work in both themes
    const chartColors = {
      blue: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)',
      green: isDarkMode ? 'rgba(52, 211, 153, 0.8)' : 'rgba(16, 185, 129, 0.8)',
      purple: isDarkMode ? 'rgba(139, 92, 246, 0.8)' : 'rgba(124, 58, 237, 0.8)',
      red: isDarkMode ? 'rgba(248, 113, 113, 0.8)' : 'rgba(220, 38, 38, 0.8)',
      yellow: isDarkMode ? 'rgba(251, 191, 36, 0.8)' : 'rgba(245, 158, 11, 0.8)',
      teal: isDarkMode ? 'rgba(45, 212, 191, 0.8)' : 'rgba(20, 184, 166, 0.8)',
      indigo: isDarkMode ? 'rgba(99, 102, 241, 0.8)' : 'rgba(79, 70, 229, 0.8)',
    };

    // Holding costs chart data for multiple years
    const holdingCostsData: ChartData<'pie'> = {
      labels: ['You', 'Tax Office', 'Tenant'],
      datasets: [
        {
          label: 'Year 1',
          data: [90, 1, 9], // Percentages 
          backgroundColor: [
            chartColors.green,
            chartColors.red,
            chartColors.blue,
          ],
          borderWidth: 1,
        }
      ]
    };

    // Holding costs progression over years
    const holdingCostsYears: ChartData<'pie'>[] = [
      // Year 1
      {
        labels: ['You', 'Tax Office', 'Tenant'],
        datasets: [{
          data: [90, 1, 9],
          backgroundColor: [chartColors.green, chartColors.red, chartColors.blue],
          borderWidth: 1,
        }]
      },
      // Year 5
      {
        labels: ['You', 'Tax Office', 'Tenant'],
        datasets: [{
          data: [73, 0, 27],
          backgroundColor: [chartColors.green, chartColors.red, chartColors.blue],
          borderWidth: 1,
        }]
      },
      // Year 10
      {
        labels: ['You', 'Tax Office', 'Tenant'],
        datasets: [{
          data: [72, 0, 28],
          backgroundColor: [chartColors.green, chartColors.red, chartColors.blue],
          borderWidth: 1,
        }]
      },
      // Year 15
      {
        labels: ['You', 'Tax Office', 'Tenant'],
        datasets: [{
          data: [71, 0, 29],
          backgroundColor: [chartColors.green, chartColors.red, chartColors.blue],
          borderWidth: 1,
        }]
      }
    ];

    // Tax deductions breakdown
    const taxDeductionsData: ChartData<'pie'> = {
      labels: ['Mortgage Interest', 'Property Taxes', 'Insurance', 'Repairs & Maintenance', 'Depreciation', 'Other'],
      datasets: [
        {
          data: [45, 22, 8, 10, 12, 3], // Percentages of total deductions
          backgroundColor: [
            chartColors.blue,
            chartColors.green,
            chartColors.purple,
            chartColors.red,
            chartColors.yellow,
            chartColors.teal,
          ],
          borderWidth: 1,
        }
      ]
    };

    // Income charts - after tax cash flow
    const years = Array.from({ length: 15 }, (_, i) => (i + 1).toString());
    
    // After tax cash flow over time
    const afterTaxCashFlowData: ChartData<'line'> = {
      labels: years,
      datasets: [
        {
          label: 'After-Tax Cash Flow',
          data: years.map(year => {
            // Simple growth calculation
            const baseValue = 4000;
            const yearNum = parseInt(year);
            return baseValue * (1 + yearNum * 0.05);
          }),
          borderColor: chartColors.green,
          backgroundColor: isDarkMode 
            ? 'rgba(52, 211, 153, 0.2)' 
            : 'rgba(16, 185, 129, 0.2)',
          fill: true,
        }
      ]
    };

    // Property value increase over time
    const propertyValueData: ChartData<'line'> = {
      labels: years,
      datasets: [
        {
          label: 'Property Value',
          data: years.map(year => {
            // Calculate property value growth
            const initialValue = parseFloat(formData.propertyValue) || 500000;
            const yearNum = parseInt(year);
            return initialValue * Math.pow(1.03, yearNum); // 3% annual appreciation
          }),
          borderColor: chartColors.purple,
          backgroundColor: 'transparent',
        }
      ]
    };

    // Total profit per year
    const totalProfitData: ChartData<'bar'> = {
      labels: years,
      datasets: [
        {
          label: 'Total Annual Profit',
          data: years.map(year => {
            // Calculate annual profit growth
            const baseProfit = 7000;
            const yearNum = parseInt(year);
            return baseProfit * (1 + yearNum * 0.08);
          }),
          backgroundColor: chartColors.blue,
        }
      ]
    };

    // Cumulative profit
    const cumulativeProfitData: ChartData<'line'> = {
      labels: years,
      datasets: [
        {
          label: 'Cumulative Profit',
          data: years.map(year => {
            // Calculate cumulative profit growth
            const baseProfit = 7000;
            const yearNum = parseInt(year);
            let cumulative = 0;
            for (let i = 1; i <= yearNum; i++) {
              cumulative += baseProfit * (1 + i * 0.08);
            }
            return cumulative;
          }),
          borderColor: chartColors.teal,
          backgroundColor: isDarkMode 
            ? 'rgba(45, 212, 191, 0.2)' 
            : 'rgba(20, 184, 166, 0.2)',
          fill: true,
        }
      ]
    };

    const chartOptions: ChartOptions<'line'> = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: isDarkMode ? '#e5e7eb' : '#111827',
          }
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDarkMode ? '#374151' : '#ffffff',
          titleColor: isDarkMode ? '#e5e7eb' : '#111827',
          bodyColor: isDarkMode ? '#e5e7eb' : '#111827',
          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
          borderWidth: 1,
        }
      },
      scales: {
        x: {
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: isDarkMode ? '#e5e7eb' : '#111827',
          }
        },
        y: {
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: isDarkMode ? '#e5e7eb' : '#111827',
          }
        }
      }
    };

    const pieChartOptions: ChartOptions<'pie'> = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: isDarkMode ? '#e5e7eb' : '#111827',
          }
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDarkMode ? '#374151' : '#ffffff',
          titleColor: isDarkMode ? '#e5e7eb' : '#111827',
          bodyColor: isDarkMode ? '#e5e7eb' : '#111827',
          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
          borderWidth: 1,
        }
      }
    };

    return {
      holdingCostsData,
      holdingCostsYears,
      taxDeductionsData,
      afterTaxCashFlowData,
      propertyValueData,
      totalProfitData,
      cumulativeProfitData,
      chartOptions,
      pieChartOptions
    };
  };

  const chartData = showResults ? generateChartData() : null;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Property Tax Calculator</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Calculate potential tax implications for your property investments including depreciation, deductions, and capital gains.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Tax Parameters Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tax Parameters</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Enter your income and property details.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="taxYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tax Year
                    </label>
                    <select
                      id="taxYear"
                      name="taxYear"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={formData.taxYear}
                      onChange={handleInputChange}
                    >
                      <option value="">Select tax year</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="filingStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filing Status
                    </label>
                    <select
                      id="filingStatus"
                      name="filingStatus"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={formData.filingStatus}
                      onChange={handleInputChange}
                    >
                      <option value="">Select filing status</option>
                      <option value="single">Single</option>
                      <option value="married-joint">Married Filing Jointly</option>
                      <option value="married-separate">Married Filing Separately</option>
                      <option value="head-household">Head of Household</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Annual Income ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="annualIncome"
                        id="annualIncome"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter annual income"
                        value={formData.annualIncome}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="propertyValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Property Value ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="propertyValue"
                        id="propertyValue"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter property value"
                        value={formData.propertyValue}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select property type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="multi-family">Multi-Family</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="rentalIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Annual Rental Income ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="rentalIncome"
                        id="rentalIncome"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter annual rental income"
                        value={formData.rentalIncome}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="mortgageInterest" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Annual Mortgage Interest ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="mortgageInterest"
                        id="mortgageInterest"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter annual mortgage interest"
                        value={formData.mortgageInterest}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="propertyExpenses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Annual Property Expenses ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="propertyExpenses"
                        id="propertyExpenses"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter annual property expenses"
                        value={formData.propertyExpenses}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="purchaseYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Year of Purchase
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="purchaseYear"
                        id="purchaseYear"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter purchase year"
                        value={formData.purchaseYear}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Calculator className="-ml-1 mr-2 h-5 w-5" />
                      Calculate Tax Impact
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Tax Calculation Results */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tax Calculation Results</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Review your property-related tax implications.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                {!showResults ? (
                  <div className="flex items-center justify-center flex-col p-8 text-center">
                    <Calculator className="h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tax calculation results yet</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Fill in the tax parameters and click &quot;Calculate Tax Impact&quot; to see your results.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Summary Metrics at the top */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          Income & Deductions
                        </h3>
                        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gross Rental Income</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              ${parseInt(formData.rentalIncome).toLocaleString() || 'N/A'}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Deductible Expenses</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              ${(() => {
                                const mortgageInterest = parseInt(formData.mortgageInterest) || 0;
                                const propertyExpenses = parseInt(formData.propertyExpenses) || 0;
                                const propertyTaxes = parseInt(formData.propertyValue) * 0.01 || 0; // Approximate property tax
                                const depreciation = parseFloat(formData.propertyValue) * 0.036 || 0; // 3.6% annual depreciation
                                return Math.round(mortgageInterest + propertyExpenses + propertyTaxes + depreciation).toLocaleString();
                              })() || 'N/A'}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxable Rental Income</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              ${(() => {
                                const rentalIncome = parseInt(formData.rentalIncome) || 0;
                                const mortgageInterest = parseInt(formData.mortgageInterest) || 0;
                                const propertyExpenses = parseInt(formData.propertyExpenses) || 0;
                                const propertyTaxes = parseInt(formData.propertyValue) * 0.01 || 0;
                                const depreciation = parseFloat(formData.propertyValue) * 0.036 || 0;
                                const taxableIncome = Math.max(0, rentalIncome - mortgageInterest - propertyExpenses - propertyTaxes - depreciation);
                                return Math.round(taxableIncome).toLocaleString();
                              })() || 'N/A'}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Effective Tax Rate</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {(() => {
                                const income = parseInt(formData.annualIncome) || 0;
                                if (income < 50000) return '12%';
                                if (income < 100000) return '22%';
                                if (income < 200000) return '24%';
                                return '32%';
                              })() || 'N/A'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          Tax Impact Summary
                        </h3>
                        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Without Property</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              ${(() => {
                                const income = parseInt(formData.annualIncome) || 0;
                                let taxRate = 0.12;
                                if (income < 50000) taxRate = 0.12;
                                if (income < 100000) taxRate = 0.22;
                                if (income < 200000) taxRate = 0.24;
                                if (income >= 200000) taxRate = 0.32;
                                return Math.round(income * taxRate).toLocaleString();
                              })() || 'N/A'}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax With Property</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              ${(() => {
                                const income = parseInt(formData.annualIncome) || 0;
                                const rentalIncome = parseInt(formData.rentalIncome) || 0;
                                const mortgageInterest = parseInt(formData.mortgageInterest) || 0;
                                const propertyExpenses = parseInt(formData.propertyExpenses) || 0;
                                const propertyTaxes = parseInt(formData.propertyValue) * 0.01 || 0;
                                const depreciation = parseFloat(formData.propertyValue) * 0.036 || 0;
                                
                                const taxableRentalIncome = Math.max(0, rentalIncome - mortgageInterest - propertyExpenses - propertyTaxes - depreciation);
                                const totalTaxableIncome = income + taxableRentalIncome;
                                
                                let taxRate = 0.12;
                                if (totalTaxableIncome < 50000) taxRate = 0.12;
                                if (totalTaxableIncome < 100000) taxRate = 0.22;
                                if (totalTaxableIncome < 200000) taxRate = 0.24;
                                if (totalTaxableIncome >= 200000) taxRate = 0.32;
                                
                                return Math.round(totalTaxableIncome * taxRate).toLocaleString();
                              })() || 'N/A'}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Tax Impact</dt>
                            <dd className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
                              ${(() => {
                                const income = parseInt(formData.annualIncome) || 0;
                                const rentalIncome = parseInt(formData.rentalIncome) || 0;
                                const mortgageInterest = parseInt(formData.mortgageInterest) || 0;
                                const propertyExpenses = parseInt(formData.propertyExpenses) || 0;
                                const propertyTaxes = parseInt(formData.propertyValue) * 0.01 || 0;
                                const depreciation = parseFloat(formData.propertyValue) * 0.036 || 0;
                                
                                // Without property
                                let taxRateWithout = 0.12;
                                if (income < 50000) taxRateWithout = 0.12;
                                if (income < 100000) taxRateWithout = 0.22;
                                if (income < 200000) taxRateWithout = 0.24;
                                if (income >= 200000) taxRateWithout = 0.32;
                                const taxWithout = income * taxRateWithout;
                                
                                // With property
                                const taxableRentalIncome = Math.max(0, rentalIncome - mortgageInterest - propertyExpenses - propertyTaxes - depreciation);
                                const totalTaxableIncome = income + taxableRentalIncome;
                                
                                let taxRateWith = 0.12;
                                if (totalTaxableIncome < 50000) taxRateWith = 0.12;
                                if (totalTaxableIncome < 100000) taxRateWith = 0.22;
                                if (totalTaxableIncome < 200000) taxRateWith = 0.24;
                                if (totalTaxableIncome >= 200000) taxRateWith = 0.32;
                                
                                const taxWith = totalTaxableIncome * taxRateWith;
                                
                                // Net impact
                                const impact = taxWith - taxWithout;
                                const prefix = impact > 0 ? '+' : '';
                                return `${prefix}${Math.round(impact).toLocaleString()}`;
                              })() || 'N/A'}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">After-Tax Cash Flow</dt>
                            <dd className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                              ${(() => {
                                const rentalIncome = parseInt(formData.rentalIncome) || 0;
                                const mortgageInterest = parseInt(formData.mortgageInterest) || 0;
                                const propertyExpenses = parseInt(formData.propertyExpenses) || 0;
                                
                                // Simplified calculation - actual would be more complex
                                const cashFlow = rentalIncome - mortgageInterest - propertyExpenses;
                                return Math.round(cashFlow).toLocaleString();
                              })() || 'N/A'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    {/* Holding Costs - Multiple Pie Charts */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Holding Costs Over Time
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {chartData!.holdingCostsYears.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              {index === 0 ? 'Year 1' : index === 1 ? 'Year 5' : index === 2 ? 'Year 10' : 'Year 15'}
                            </h4>
                            <div className="h-48 w-full flex items-center justify-center">
                              <Pie 
                                data={data} 
                                options={chartData!.pieChartOptions}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Expense Charts - 4 Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Tax Deductions Breakdown */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Tax Deductions Breakdown
                        </h3>
                        <div className="h-64">
                          <Doughnut 
                            data={chartData!.taxDeductionsData} 
                            options={chartData!.pieChartOptions}
                          />
                        </div>
                      </div>
                      
                      {/* After Tax Cash Flow */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          After Tax Cash Flow
                        </h3>
                        <div className="h-64">
                          <Line 
                            data={chartData!.afterTaxCashFlowData} 
                            options={chartData!.chartOptions}
                          />
                        </div>
                      </div>
                      
                      {/* Property Value */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Property Value
                        </h3>
                        <div className="h-64">
                          <Line 
                            data={chartData!.propertyValueData} 
                            options={chartData!.chartOptions}
                          />
                        </div>
                      </div>
                      
                      {/* Total Profit Per Year */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Total Profit Per Year
                        </h3>
                        <div className="h-64">
                          <Bar 
                            data={chartData!.totalProfitData} 
                            options={chartData!.chartOptions}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Cumulative Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Cumulative Cash Flow */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Cumulative Cash Flow
                        </h3>
                        <div className="h-64">
                          <Line 
                            data={chartData!.afterTaxCashFlowData} 
                            options={chartData!.chartOptions}
                          />
                        </div>
                      </div>
                      
                      {/* Cumulative Profit */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Cumulative Profit
                        </h3>
                        <div className="h-64">
                          <Line 
                            data={chartData!.cumulativeProfitData} 
                            options={chartData!.chartOptions}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Download Section */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <DownloadCloud className="-ml-1 mr-2 h-5 w-5" />
                        Download Tax Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}