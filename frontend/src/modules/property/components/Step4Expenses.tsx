'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

type Props = {
    data: Record<string, number | undefined>
    updateFields: (fields: Partial<Record<string, number>>) => void
    onNext: () => void
    onBack: () => void
}

export default function Step4Expenses({ data, updateFields, onNext, onBack }: Props) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm({
        defaultValues: data,
        mode: 'onChange',
    })

    const handleNext = (values: any) => {
        setLoading(true)

        const parsed = Object.fromEntries(
            Object.entries(values).map(([k, v]) => [k, v !== '' && v !== undefined ? Number(v) : 0])
        )

        setTimeout(() => {
            updateFields(parsed)
            onNext()
        }, 400)
    }

    const allExpenseFields = [
        { key: 'council_rates', label: 'Council Rates ($/yr)', required: true },
        { key: 'insurance', label: 'Insurance ($/yr)', required: true },
        { key: 'maintenance', label: 'Maintenance ($/yr)', required: true },
        { key: 'property_manager', label: 'Property Manager ($/yr)', required: true },
        { key: 'strata', label: 'Strata ($/yr)', required: false },
        { key: 'water', label: 'Water Charges ($/yr)', required: false },
        { key: 'cleaning', label: 'Cleaning ($/yr)', required: false },
        { key: 'gardening', label: 'Gardening/Mowing ($/yr)', required: false },
        { key: 'land_tax', label: 'Land Tax ($/yr)', required: false },
        { key: 'legal_expenses', label: 'Legal Expenses ($/yr)', required: false },
        { key: 'pest_control', label: 'Pest Control ($/yr)', required: false },
        { key: 'bookkeeping', label: 'Bookkeeping ($/yr)', required: false },
        { key: 'postage', label: 'Postage & Stationery ($/yr)', required: false },
        { key: 'tax_related_expenses', label: 'Tax Related Expenses ($/yr)', required: false },
        { key: 'travel', label: 'Travel & Car Expenses ($/yr)', required: false },
        { key: 'once_off_expenses', label: 'Once-Off Expenses ($)', required: false },
    ]

    return (
        <form onSubmit={handleSubmit(handleNext)} className="space-y-6 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800">4. Expense Details</h2>

            {allExpenseFields.map(({ key, label, required }) => (
                <div key={key}>
                    <label className="block text-gray-700 font-semibold mb-1">
                        {label} {!required && <span className="text-gray-400">(optional)</span>}
                    </label>
                    <input
                        type="number"
                        step="any"
                        {...register(key, { required: required ? true : false, min: 0 })}
                        className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${required
                                ? 'border-gray-300 focus:ring-blue-500'
                                : 'border-gray-300 focus:ring-blue-300'
                            }`}
                        placeholder={required ? 'e.g. 1000' : 'e.g. 0'}
                    />
                </div>
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
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
                    className={`px-6 py-2 rounded-md text-white font-semibold transition ${!isValid || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Loading...' : 'Next →'}
                </button>
            </div>
        </form>
    )
}
