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
        'stamp_duty', 'gst', 'legal_fees', 'disbursements', 'building_inspection', 'registration_title'
    ]

    const borrowingCosts = [
        'mortgage_stamp_duty', 'mortgage_insurance_1', 'stamp_duty_mi_1', 'mortgage_insurance_2',
        'stamp_duty_mi_2', 'loan_app_fee', 'valuation_fee', 'search_fees', 'registration_mortgage'
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800">2. Cost Breakdown</h2>

            {/* Purchase Costs */}
            <h3 className="text-sm font-semibold text-gray-600">Purchase Costs</h3>
            {purchaseCosts.map(field => (
                <div key={field}>
                    <label className="block font-medium mb-1 text-gray-700 capitalize">{field.replace(/_/g, ' ')}</label>
                    <input
                        type="number"
                        step="any"
                        {...register(field)}
                        className="w-full border rounded-md px-4 py-2 border-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500"
                    />
                </div>
            ))}

            {/* Borrowing Costs */}
            <h3 className="text-sm font-semibold text-gray-600 pt-4">Borrowing Costs</h3>
            {borrowingCosts.map(field => (
                <div key={field}>
                    <label className="block font-medium mb-1 text-gray-700 capitalize">{field.replace(/_/g, ' ')}</label>
                    <input
                        type="number"
                        step="any"
                        {...register(field)}
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
                    className={`px-6 py-2 rounded-md text-white font-semibold transition ${!isValid || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Loading...' : 'Next →'}
                </button>
            </div>
        </form>
    )
}
