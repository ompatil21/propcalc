'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

type Props = {
    data: Record<string, number | undefined>
    updateFields: (fields: Partial<Record<string, number>>) => void
    onNext: () => void
    onBack: () => void
}

export default function Step2BCostBreakdown({ data, updateFields, onNext, onBack }: Props) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm({
        defaultValues: data,
        mode: 'onChange',
    })

    const onSubmit = (values: any) => {
        setLoading(true)
        setTimeout(() => {
            updateFields(values)
            onNext()
        }, 500)
    }

    const purchaseCosts = [
        { key: 'stamp_duty', label: 'Stamp Duty' },
        { key: 'gst', label: 'GST' },
        { key: 'legal_fees', label: 'Legal Fees' },
        { key: 'disbursements', label: 'Disbursements' },
        { key: 'building_inspection', label: 'Building Inspection' },
        { key: 'registration_title', label: 'Registration of Title' },
    ]

    const borrowingCosts = [
        { key: 'mortgage_stamp_duty', label: 'Mortgage Stamp Duty' },
        { key: 'mortgage_insurance_1', label: 'Mortgage Insurance #1' },
        { key: 'stamp_duty_mi_1', label: 'Stamp Duty on MI #1' },
        { key: 'mortgage_insurance_2', label: 'Mortgage Insurance #2' },
        { key: 'stamp_duty_mi_2', label: 'Stamp Duty on MI #2' },
        { key: 'loan_app_fee', label: 'Loan Application Fee' },
        { key: 'valuation_fee', label: 'Valuation Fee' },
        { key: 'search_fees', label: 'Search Fees' },
        { key: 'registration_mortgage', label: 'Registration of Mortgage' },
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800">2B. Cost Breakdown</h2>

            {/* Purchase Costs */}
            <h3 className="text-sm font-semibold text-gray-600">Purchase Costs</h3>
            {purchaseCosts.map(({ key, label }) => (
                <div key={key}>
                    <label className="block font-medium mb-1 text-gray-700">{label}</label>
                    <input
                        type="number"
                        step="any"
                        {...register(key)}
                        className="w-full border rounded-md px-4 py-2 border-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500"
                    />
                </div>
            ))}

            {/* Borrowing Costs */}
            <h3 className="text-sm font-semibold text-gray-600 pt-4">Borrowing Costs</h3>
            {borrowingCosts.map(({ key, label }) => (
                <div key={key}>
                    <label className="block font-medium mb-1 text-gray-700">{label}</label>
                    <input
                        type="number"
                        step="any"
                        {...register(key)}
                        className="w-full border rounded-md px-4 py-2 border-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500"
                    />
                </div>
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
                >
                    ← Back
                </button>

                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className={`px-6 py-2 rounded-md text-white font-semibold transition ${!isValid || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Loading...' : 'Next →'}
                </button>
            </div>
        </form>
    )
}
