'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
    User, Percent, DollarSign, PlusCircle, Trash2, Info
} from 'lucide-react'

type Owner = {
    name: string
    ownership: number | undefined
    income: number | undefined
}

type Props = {
    data: {
        owners: Owner[]
        wage_growth: number | undefined
        date_of_purchase?: string
        rental_growth?: number
        capital_growth_rate?: number
        date_of_construction?: string
        date_of_sale?: string
        buildings_value?: number
        fittings_value?: number
        inflation?: number
        preferred_lvr?: number
        medicare_surcharge?: boolean
    }
    updateFields: (fields: Partial<Props['data']>) => void
    onBack: () => void
    onSubmit: (finalData: any) => void
}

export default function Step5OwnershipIncome({ data, onBack, onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            owners: data.owners || [],
            wage_growth: data.wage_growth ?? undefined,
            date_of_purchase: data.date_of_purchase ?? '',
            rental_growth: data.rental_growth ?? undefined,
            capital_growth_rate: data.capital_growth_rate ?? undefined,
            date_of_construction: data.date_of_construction ?? '',
            date_of_sale: data.date_of_sale ?? '',
            buildings_value: data.buildings_value ?? undefined,
            fittings_value: data.fittings_value ?? undefined,
            inflation: data.inflation ?? undefined,
            preferred_lvr: data.preferred_lvr ?? undefined,
            medicare_surcharge: data.medicare_surcharge ?? false


        },
        mode: 'onChange',
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'owners',
    })

    const [submitting, setSubmitting] = useState(false)

    const watchOwners = watch('owners')
    const totalOwnership = watchOwners?.reduce((acc: number, owner: Owner) => {
        return acc + (Number(owner.ownership) || 0)
    }, 0)

    const handleFinalSubmit = (values: any) => {
        if (submitting) return
        setSubmitting(true)

        const validOwners = values.owners.filter(
            (owner: any) =>
                owner.name.trim() !== '' &&
                owner.ownership !== undefined &&
                owner.income !== undefined &&
                owner.ownership > 0 &&
                owner.income > 0
        )

        const totalOwnership = validOwners.reduce(
            (acc: number, owner: any) => acc + Number(owner.ownership),
            0
        )

        if (validOwners.length === 0) {
            alert('Please add at least one valid owner.')
            setSubmitting(false)
            return
        }

        if (totalOwnership !== 100) {
            alert(`Total ownership must be exactly 100%. Currently: ${totalOwnership}%`)
            setSubmitting(false)
            return
        }

        const parsedValues = {
            ...values,
            wage_growth: Number(values.wage_growth),
            rental_growth: Number(values.rental_growth),
            capital_growth_rate: Number(values.capital_growth_rate),
            buildings_value: Number(values.buildings_value),
            fittings_value: Number(values.fittings_value),
            inflation: Number(values.inflation),
            preferred_lvr: Number(values.preferred_lvr),
            medicare_surcharge: Boolean(values.medicare_surcharge),
            owners: validOwners.map((owner: any) => ({
                name: owner.name.trim(),
                ownership: Number(owner.ownership),
                income: Number(owner.income),
            }))
        }

        const combined = {
            ...data,
            ...parsedValues,
        }

        console.log("🚀 Submitting to backend:", combined)
        onSubmit(combined)
    }

    return (
        <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-8">
            {/* 👥 Ownership */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">👥 Ownership Structure</h3>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Info size={16} className="text-blue-500" />
                        Total ownership must equal 100%
                    </div>
                    <span className={`px-3 py-1 rounded-full font-medium ${totalOwnership === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Ownership: {totalOwnership || 0}%
                    </span>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-md space-y-3 bg-gray-50 relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="font-medium text-gray-700 mb-1 block">Owner Name</label>
                                <input
                                    {...register(`owners.${index}.name`, { required: true })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 mb-1 block">Ownership %</label>
                                <input
                                    type="number"
                                    {...register(`owners.${index}.ownership`, { required: true, min: 0, max: 100 })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 mb-1 block">Income ($)</label>
                                <input
                                    type="number"
                                    {...register(`owners.${index}.income`, { required: true, min: 0 })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            title="Remove owner"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => append({ name: '', ownership: undefined, income: undefined })}
                    className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                    <PlusCircle size={18} /> Add Owner
                </button>
            </div>

            {/* 📈 Growth Forecasts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        📈 Rental Growth Rate (%) <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        {...register('rental_growth')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        📈 Capital Growth Rate (%) <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        {...register('capital_growth_rate')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            {/* 📆 Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">📅 Date of Purchase</label>
                    <input
                        type="date"
                        {...register('date_of_purchase', { required: true })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">🏗️ Date of Construction</label>
                    <input
                        type="date"
                        {...register('date_of_construction', { required: true })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        🏁 Date of Sale <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="date"
                        {...register('date_of_sale')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            {/* 📉 Depreciation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        🏢 Buildings Value (%) <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        {...register('buildings_value')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        🛋️ Fittings Value ($) <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        {...register('fittings_value')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            {/* ⚙️ Forecast Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        📉 Inflation Rate (%) <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        {...register('inflation')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        📊 Preferred LVR (%) <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        {...register('preferred_lvr')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            {/* 🏥 Medicare Levy Surcharge */}
            <div className="pt-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    {...register("medicare_surcharge")}
                    className="w-4 h-4 border-gray-300"
                />
                <label className="text-gray-700 font-medium">
                    Apply Medicare Levy Surcharge? <span className="text-gray-400">(optional)</span>
                </label>
            </div>


            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
                >
                    ← Back
                </button>
                <button
                    type="submit"
                    disabled={!isValid || submitting || totalOwnership !== 100}
                    className={`px-6 py-2 rounded-md text-white font-semibold transition ${isValid && totalOwnership === 100 && !submitting
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    Submit →
                </button>
            </div>
        </form>
    )

}
