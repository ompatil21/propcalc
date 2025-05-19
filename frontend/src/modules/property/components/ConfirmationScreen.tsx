'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Home, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

type Props = {
    data: any
    onDone: () => void
}

const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        maximumFractionDigits: 0,
    }).format(Number(value))

const calculateROI = (data: any) => {
    const totalInvestment =
        Number(data.deposit) +
        Number(data.council_rates) +
        Number(data.insurance)
    const annualRent =
        Number(data.rent) * 12 * (1 - Number(data.vacancy_rate) / 100)
    return ((annualRent / totalInvestment) * 100).toFixed(2)
}

const calculateMonthlyCashFlow = (data: any) => {
    const income = Number(data.rent)
    const expenses =
        (Number(data.council_rates) +
            Number(data.insurance) +
            Number(data.maintenance) +
            Number(data.property_manager)) /
        12
    return formatCurrency(income - expenses)
}

export default function ConfirmationScreen({ data, onDone }: Props) {
    const roi = calculateROI(data)
    const cashFlow = calculateMonthlyCashFlow(data)

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto text-center"
        >
            {/* Checkmark */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                className="flex justify-center mb-6 text-green-600"
            >
                <CheckCircle size={64} strokeWidth={1.5} />
            </motion.div>

            {/* Headline */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                🎉 Property Added Successfully!
            </h2>
            <p className="text-gray-600 mb-6 text-base">
                Here's what you've entered
            </p>

            {/* Data Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 border border-gray-200 rounded-lg p-6 text-left text-sm text-gray-700">
                {/* Basic Info */}
                <div>
                    <h4 className="font-semibold mb-1 text-blue-700">🏡 Basic Info</h4>
                    <p><strong>Title:</strong> {data.title}</p>
                    <p><strong>Location:</strong> {data.location}</p>
                    <p><strong>Type:</strong> {data.type}</p>
                    <p><strong>State:</strong> {data.state}</p>
                </div>

                {/* Loan & Cost */}
                <div>
                    <h4 className="font-semibold mb-1 text-blue-700">💸 Financials</h4>
                    <p><strong>Deposit:</strong> {formatCurrency(data.deposit)}</p>
                    <p><strong>Loan Amount:</strong> {formatCurrency(data.loan_amount)}</p>
                    <p><strong>Interest Rate:</strong> {data.interest_rate}%</p>
                    <p><strong>Loan Term:</strong> {data.loan_term} yrs</p>
                </div>

                {/* Rental Info */}
                <div>
                    <h4 className="font-semibold mb-1 text-blue-700">🏠 Rental Details</h4>
                    <p><strong>Rent:</strong> {formatCurrency(data.rent)} / month</p>
                    <p><strong>Vacancy Rate:</strong> {data.vacancy_rate}%</p>
                    <p><strong>Rental Growth:</strong> {data.rental_growth || 0}%</p>
                </div>

                {/* Purchase & Ownership */}
                <div>
                    <h4 className="font-semibold mb-1 text-blue-700">📅 Purchase & Ownership</h4>
                    <p><strong>Date of Purchase:</strong> {data.date_of_purchase || '—'}</p>
                    <p><strong>Date of Construction:</strong> {data.date_of_construction || '—'}</p>
                    {data.date_of_sale && data.date_of_sale.trim() !== '' && (
                        <p><strong>Date of Sale:</strong> {data.date_of_sale}</p>
                    )}
                    <p><strong>Wage Growth:</strong> {data.wage_growth ?? 0}%</p>
                </div>

                {/* Forecast Settings */}
                <div>
                    <h4 className="font-semibold mb-1 text-blue-700">📉 Forecast Settings</h4>
                    <p><strong>Capital Growth:</strong> {data.capital_growth_rate ?? 0}%</p>
                    <p><strong>Inflation Rate:</strong> {data.inflation ?? 0}%</p>
                    <p><strong>Buildings Value:</strong> {data.buildings_value ?? 0}%</p>
                    <p><strong>Fittings Value:</strong> {formatCurrency(data.fittings_value ?? 0)}</p>
                    <p><strong>Preferred LVR:</strong> {data.preferred_lvr ?? 0}%</p>
                    <p><strong>Medicare Surcharge:</strong> {data.medicare_surcharge ? 'Yes' : 'No'}</p>
                </div>

                {/* ROI Summary */}
                <div>
                    <h4 className="font-semibold mb-1 text-blue-700">📊 ROI Summary</h4>
                    <p><strong>ROI:</strong> {roi}%</p>
                    <p><strong>Monthly Cash Flow:</strong> {cashFlow}</p>
                </div>

                {/* Ownership Breakdown */}
                <div className="sm:col-span-2">
                    <h4 className="font-semibold mb-1 text-blue-700">👥 Ownership Breakdown</h4>
                    <div className="space-y-1">
                        {Array.isArray(data.owners) && data.owners.length > 0 ? (
                            data.owners
                                .sort((a: any, b: any) => b.ownership - a.ownership)
                                .map((owner: any, i: number) => (
                                    <p key={i}>
                                        <strong>{owner.name || 'Unnamed'}</strong> – {Number(owner.ownership ?? 0)}% @ ${Number(owner.income ?? 0).toLocaleString()}
                                    </p>
                                ))
                        ) : (
                            <p className="text-gray-500 italic">No owner data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={onDone}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition"
                >
                    <Home size={18} /> Add Another Property
                </button>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-md transition"
                >
                    <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
            </div>
        </motion.div>
    )
}
