'use client';

import * as React from "react";
import { Calculator, ChevronDown } from "lucide-react";
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
import { Bar, Line, Pie } from 'react-chartjs-2';

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

export default function SimulatorPage() {
  const [formData, setFormData] = React.useState({
    propertyType: '',
    purchasePrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '',
    monthlyRentalIncome: '',
    monthlyExpenses: '',
    annualAppreciation: '',
    investmentPeriod: ''
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
    const years = Array.from({ length: parseInt(formData.investmentPeriod) || 10 }, (_, i) => (i + 1).toString());
    
    // Base colors that work in both themes
    const chartColors = {
      blue: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)',
      green: isDarkMode ? 'rgba(52, 211, 153, 0.8)' : 'rgba(16, 185, 129, 0.8)',
      purple: isDarkMode ? 'rgba(139, 92, 246, 0.8)' : 'rgba(124, 58, 237, 0.8)',
      red: isDarkMode ? 'rgba(248, 113, 113, 0.8)' : 'rgba(220, 38, 38, 0.8)',
      yellow: isDarkMode ? 'rgba(251, 191, 36, 0.8)' : 'rgba(245, 158, 11, 0.8)',
    };

    // Property value growth chart
    const propertyValueData: ChartData<'line'> = {
      labels: years,
      datasets: [
        {
          label: 'Property Value ($)',
          data: years.map(year => {
            // Simple compound growth calculation based on inputs
            const yearNum = parseInt(year);
            const initialValue = parseFloat(formData.purchasePrice) || 500000;
            const appreciation = parseFloat(formData.annualAppreciation) || 3;
            return Math.round(initialValue * Math.pow(1 + appreciation / 100, yearNum));
          }),
          borderColor: chartColors.purple,
          backgroundColor: isDarkMode 
            ? 'rgba(139, 92, 246, 0.2)' 
            : 'rgba(124, 58, 237, 0.2)',
          fill: true,
        }
      ]
    };

    // Cash flow chart
    const cashFlowData: ChartData<'bar'> = {
      labels: years,
      datasets: [
        {
          label: 'Annual Cash Flow ($)',
          data: years.map(year => {
            // Simplified cash flow calculation
            const monthlyRent = parseFloat(formData.monthlyRentalIncome) || 3000;
            const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 800;
            const purchasePrice = parseFloat(formData.purchasePrice) || 500000;
            const downPayment = parseFloat(formData.downPayment) || 20;
            const interestRate = parseFloat(formData.interestRate) || 4.5;
            const loanTerm = parseFloat(formData.loanTerm) || 30;
            
            // Simplified mortgage calculation
            const loanAmount = purchasePrice * (1 - downPayment / 100);
            const monthlyInterest = interestRate / 100 / 12;
            const totalPayments = loanTerm * 12;
            const mortgagePayment = loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments) / (Math.pow(1 + monthlyInterest, totalPayments) - 1);
            
            const monthlyCashFlow = monthlyRent - monthlyExpenses - mortgagePayment;
            return Math.round(monthlyCashFlow * 12);
          }),
          backgroundColor: chartColors.green,
        }
      ]
    };

    // Equity Growth Chart
    const equityData: ChartData<'line'> = {
      labels: years,
      datasets: [
        {
          label: 'Equity Growth ($)',
          data: years.map(year => {
            const yearNum = parseInt(year);
            const initialValue = parseFloat(formData.purchasePrice) || 500000;
            const appreciation = parseFloat(formData.annualAppreciation) || 3;
            const downPayment = parseFloat(formData.downPayment) || 20;
            const loanTerm = parseFloat(formData.loanTerm) || 30;
            
            // Future property value
            const futureValue = initialValue * Math.pow(1 + appreciation / 100, yearNum);
            
            // Simplified remaining loan calculation
            const loanAmount = initialValue * (1 - downPayment / 100);
            const remainingLoanPercentage = Math.max(0, 1 - yearNum / loanTerm);
            const remainingLoan = loanAmount * remainingLoanPercentage;
            
            // Equity = property value - remaining loan
            return Math.round(futureValue - remainingLoan);
          }),
          borderColor: chartColors.blue,
          backgroundColor: 'transparent',
        }
      ]
    };

    // Holding cost breakdown (pie chart)
    const holdingCostData: ChartData<'pie'> = {
      labels: ['Mortgage', 'Property Taxes', 'Insurance', 'Maintenance', 'Other'],
      datasets: [
        {
          data: [65, 15, 10, 5, 5], // Percentages of total costs
          backgroundColor: [
            chartColors.blue,
            chartColors.green,
            chartColors.purple,
            chartColors.red,
            chartColors.yellow,
          ],
          borderWidth: 1,
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
      propertyValueData,
      cashFlowData,
      equityData,
      holdingCostData,
      chartOptions,
      pieChartOptions
    };
  };

  const chartData = showResults ? generateChartData() : null;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Investment Simulator</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Simulate different property investment scenarios to analyze potential returns and risks.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Investment Parameters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Investment Parameters</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Enter your investment details to simulate returns.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                      <option value="single-family">Single Family</option>
                      <option value="multi-family">Multi-Family</option>
                      <option value="condo">Condo</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Purchase Price ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="purchasePrice"
                        id="purchasePrice"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter purchase price"
                        value={formData.purchasePrice}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Down Payment (%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="downPayment"
                        id="downPayment"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter down payment percentage"
                        value={formData.downPayment}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Interest Rate (%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        name="interestRate"
                        id="interestRate"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter interest rate"
                        value={formData.interestRate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Loan Term (years)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="loanTerm"
                        id="loanTerm"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter loan term"
                        value={formData.loanTerm}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="monthlyRentalIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Monthly Rental Income ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="monthlyRentalIncome"
                        id="monthlyRentalIncome"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter monthly rental income"
                        value={formData.monthlyRentalIncome}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Monthly Expenses ($)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="monthlyExpenses"
                        id="monthlyExpenses"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter monthly expenses"
                        value={formData.monthlyExpenses}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="annualAppreciation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Annual Appreciation (%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.1"
                        name="annualAppreciation"
                        id="annualAppreciation"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter annual appreciation rate"
                        value={formData.annualAppreciation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="investmentPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Investment Period (years)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="investmentPeriod"
                        id="investmentPeriod"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                        placeholder="Enter investment period"
                        value={formData.investmentPeriod}
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
                      Run Simulation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Simulation Results */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Simulation Results</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Review your projected returns and investment metrics.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                {!showResults ? (
                  <div className="flex items-center justify-center flex-col p-8 text-center">
                    <Calculator className="h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No simulation results yet</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Fill in the investment parameters and click &quot;Run Simulation&quot; to see your results.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Property Value Growth Chart */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Property Value Growth
                      </h3>
                      <div className="h-64">
                        <Line 
                          data={chartData!.propertyValueData} 
                          options={chartData!.chartOptions} 
                        />
                      </div>
                    </div>
                    
                    {/* Cash Flow Chart */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Annual Cash Flow
                      </h3>
                      <div className="h-64">
                        <Bar 
                          data={chartData!.cashFlowData} 
                          options={chartData!.chartOptions}
                        />
                      </div>
                    </div>
                    
                    {/* Grid of Two Charts */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Equity Growth */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Equity Growth
                        </h3>
                        <div className="h-64">
                          <Line 
                            data={chartData!.equityData} 
                            options={chartData!.chartOptions}
                          />
                        </div>
                      </div>
                      
                      {/* Holding Costs Breakdown */}
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                          Holding Costs Breakdown
                        </h3>
                        <div className="h-64 flex items-center justify-center">
                          <Pie 
                            data={chartData!.holdingCostData} 
                            options={chartData!.pieChartOptions}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Summary Metrics */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                        Investment Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cash on Cash Return</p>
                          <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                            {(() => {
                              // Calculate cash on cash return
                              const monthlyRent = parseFloat(formData.monthlyRentalIncome) || 0;
                              const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 0;
                              const purchasePrice = parseFloat(formData.purchasePrice) || 0;
                              const downPayment = parseFloat(formData.downPayment) || 0;
                              
                              if (purchasePrice && downPayment && monthlyRent && monthlyExpenses) {
                                const annualCashFlow = (monthlyRent - monthlyExpenses) * 12;
                                const initialInvestment = purchasePrice * (downPayment / 100);
                                const cashOnCash = (annualCashFlow / initialInvestment) * 100;
                                return `${cashOnCash.toFixed(2)}%`;
                              }
                              return "N/A";
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cap Rate</p>
                          <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                            {(() => {
                              // Calculate cap rate
                              const monthlyRent = parseFloat(formData.monthlyRentalIncome) || 0;
                              const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 0;
                              const purchasePrice = parseFloat(formData.purchasePrice) || 0;
                              
                              if (purchasePrice && monthlyRent && monthlyExpenses) {
                                const annualCashFlow = (monthlyRent - monthlyExpenses) * 12;
                                const capRate = (annualCashFlow / purchasePrice) * 100;
                                return `${capRate.toFixed(2)}%`;
                              }
                              return "N/A";
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Return</p>
                          <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                            {(() => {
                              // Calculate total return over the investment period
                              const initialValue = parseFloat(formData.purchasePrice) || 0;
                              const appreciation = parseFloat(formData.annualAppreciation) || 0;
                              const period = parseInt(formData.investmentPeriod) || 0;
                              
                              if (initialValue && appreciation && period) {
                                const futureValue = initialValue * Math.pow(1 + appreciation / 100, period);
                                const totalReturn = ((futureValue - initialValue) / initialValue) * 100;
                                return `${totalReturn.toFixed(2)}%`;
                              }
                              return "N/A";
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Final Property Value</p>
                          <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                            {(() => {
                              // Calculate final property value
                              const initialValue = parseFloat(formData.purchasePrice) || 0;
                              const appreciation = parseFloat(formData.annualAppreciation) || 0;
                              const period = parseInt(formData.investmentPeriod) || 0;
                              
                              if (initialValue && appreciation && period) {
                                const futureValue = initialValue * Math.pow(1 + appreciation / 100, period);
                                return `$${Math.round(futureValue).toLocaleString()}`;
                              }
                              return "N/A";
                            })()}
                          </p>
                        </div>
                      </div>
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