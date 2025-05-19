'use client'

import { useForm } from 'react-hook-form'
import {
    DollarSign,
    Percent,
    Calendar,
    Banknote,
    FileText,
    Building2,
    BadgeDollarSign,
    ReceiptText,
    ScrollText,
} from 'lucide-react'

type Props = {
    data: {
        purchase_price: number | undefined
        deposit: number | undefined
        loan_amount: number | undefined
        interest_rate: number | undefined
        loan_term: number | undefined
        // Purchase Costs
        stamp_duty?: number
        gst?: number
        legal_fees?: number
        disbursements?: number
        building_inspection?: number
        registration_title?: number
        // Borrowing Costs
        mortgage_stamp_duty?: number
        mortgage_insurance_1?: number
        stamp_duty_mi_1?: number
        mortgage_insurance_2?: number
        stamp_duty_mi_2?: number
        loan_app_fee?: number
        valuation_fee?: number
        search_fees?: number
        registration_mortgage?: number
    }
    updateFields: (fields: Partial<Props['data']>) => void
    onNext: () => void
    onBack: () => void
}

export default function Step2PurchaseDetails({ data, updateFields, onNext, onBack }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: data,
        mode: 'onChange',
    })

    const onSubmit = (values: any) => {
        updateFields(values)
        onNext()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all duration-300">

            {/* ---------------------- */}
            {/* 🔹 1. Purchase Details */}
            {/* ---------------------- */}
            <h2 className="text-lg font-semibold text-gray-800">1. Purchase Details</h2>

            {/* Purchase Price */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <DollarSign size={18} /> Purchase Price
                </label>
                <input
                    type="number"
                    {...register('purchase_price', { required: true, min: 1 })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.purchase_price ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                    placeholder="e.g. 500000"
                />
            </div>

            {/* Deposit */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <Banknote size={18} /> Deposit
                </label>
                <input
                    type="number"
                    {...register('deposit', { required: true, min: 0 })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.deposit ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                />
            </div>

            {/* Loan Amount */}
            <div>
                <label className="block font-semibold mb-1 flex items-center gap-2 text-gray-700">
                    <DollarSign size={18} /> Loan Amount
                </label>
                <input
                    type="number"
                    {...register('loan_amount', { required: true, min: 0 })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.loan_amount ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
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
                    className={`w-full border rounded-md px-4 py-2 ${errors.interest_rate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
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
                    className={`w-full border rounded-md px-4 py-2 ${errors.loan_term ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                />
            </div>

            {/* ------------- */}
            {/* 🔹 2. Costs */}
            {/* ------------- */}
            <h2 className="text-lg font-semibold text-gray-800 pt-6">2. Costs</h2>

            {/* --- Purchase Costs --- */}
            <h3 className="text-sm font-semibold text-gray-600">Purchase Costs</h3>
            {[
                { label: "Stamp Duty", name: "stamp_duty" },
                { label: "GST", name: "gst" },
                { label: "Legal Fees", name: "legal_fees" },
                { label: "Disbursements", name: "disbursements" },
                { label: "Building Inspections", name: "building_inspection" },
                { label: "Registration of Title", name: "registration_title" },
            ].map((field) => (
                <div key={field.name}>
                    <label className="block font-medium mb-1 text-gray-700">{field.label}</label>
                    <input
                        type="number"
                        step="any"
                        {...register(field.name as keyof Props["data"])}
                        className="w-full border rounded-md px-4 py-2 border-gray-300 focus:ring-2 focus:outline-none focus:ring-blue-500"
                    />
                </div>
            ))}

            {/* --- Borrowing Costs --- */}
            <h3 className="text-sm font-semibold text-gray-600 pt-4">Borrowing Costs</h3>
            {[
                { label: "Mortgage Stamp Duty", name: "mortgage_stamp_duty" },
                { label: "Mortgage Insurance #1", name: "mortgage_insurance_1" },
                { label: "Stamp Duty on MI #1", name: "stamp_duty_mi_1" },
                { label: "Mortgage Insurance #2", name: "mortgage_insurance_2" },
                { label: "Stamp Duty on MI #2", name: "stamp_duty_mi_2" },
                { label: "Loan Application Fee", name: "loan_app_fee" },
                { label: "Valuation Fee", name: "valuation_fee" },
                { label: "Search Fees", name: "search_fees" },
                { label: "Registration of Mortgage", name: "registration_mortgage" },
            ].map((field) => (
                <div key={field.name}>
                    <label className="block font-medium mb-1 text-gray-700">{field.label}</label>
                    <input
                        type="number"
                        step="any"
                        {...register(field.name as keyof Props["data"])}
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
                    disabled={!isValid}
                    className={`px-6 py-2 rounded-md text-white font-semibold transition ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    Next →
                </button>
            </div>
        </form>
    )
}
