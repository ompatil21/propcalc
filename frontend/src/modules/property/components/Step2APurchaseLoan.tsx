'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { DollarSign, Percent, Calendar, Banknote } from 'lucide-react'

type Props = {
    data: {
        purchase_price?: number
        deposit?: number
        loan_amount?: number
        interest_rate?: number
        loan_term?: number
    }
    updateFields: (fields: Partial<Props['data']>) => void
    onNext: () => void
    onBack: () => void
}

export default function Step2APurchaseLoan({ data, updateFields, onNext, onBack }: Props) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800">1. Purchase & Loan Details</h2>

            {/* Purchase Price */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <DollarSign size={18} /> Purchase Price ($)
                </label>
                <input
                    type="number"
                    {...register('purchase_price', { required: true, min: 1 })}
                    className="w-full border rounded-md px-4 py-2"
                />
            </div>

            {/* Deposit */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <Banknote size={18} /> Deposit ($)
                </label>
                <input
                    type="number"
                    {...register('deposit', { required: true, min: 0 })}
                    className="w-full border rounded-md px-4 py-2"
                />
            </div>

            {/* Loan Amount */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <DollarSign size={18} /> Loan Amount ($)
                </label>
                <input
                    type="number"
                    {...register('loan_amount', { required: true, min: 0 })}
                    className="w-full border rounded-md px-4 py-2"
                />
            </div>

            {/* Interest Rate */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <Percent size={18} /> Interest Rate (%)
                </label>
                <input
                    type="number"
                    step="0.01"
                    {...register('interest_rate', { required: true, min: 0 })}
                    className="w-full border rounded-md px-4 py-2"
                />
            </div>

            {/* Loan Term */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <Calendar size={18} /> Loan Term (Years)
                </label>
                <input
                    type="number"
                    {...register('loan_term', { required: true, min: 1 })}
                    className="w-full border rounded-md px-4 py-2"
                />
            </div>

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
