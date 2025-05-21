'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { PlusCircle, Trash2, Info } from 'lucide-react'

type Owner = {
    name: string
    ownership: number | undefined
    income: number | undefined
}

type Props = {
    data: any
    updateFields: (fields: Partial<any>) => void
    onBack: () => void
    onSubmit: (finalData: any) => void
}

export default function Step5OwnershipIncome({ data, onBack, onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { isValid },
    } = useForm({
        defaultValues: data,
        mode: 'onChange',
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'owners',
    })

    const [submitting, setSubmitting] = useState(false)
    const watchOwners = watch('owners')
    const totalOwnership: number =
        (watchOwners as Owner[] | undefined)?.reduce(
            (acc: number, owner: Owner) => acc + (Number(owner.ownership) || 0),
            0
        ) ?? 0

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

        if (validOwners.length === 0 || totalOwnership !== 100) {
            alert(
                validOwners.length === 0
                    ? 'Please add at least one valid owner.'
                    : `Total ownership must be exactly 100%. Currently: ${totalOwnership}%`
            )
            setSubmitting(false)
            return
        }

        const numericFields = [
            'wage_growth',
            'rental_growth',
            'capital_growth_rate',
            'buildings_value',
            'fittings_value',
            'inflation',
            'preferred_lvr',
        ]

        const parsed: any = {
            ...values,
            owners: validOwners.map((o: any) => ({
                name: o.name.trim(),
                ownership: Number(o.ownership),
                income: Number(o.income),
            })),
            medicare_surcharge: Boolean(values.medicare_surcharge),
            date_of_sale: values.date_of_sale || undefined,
        }

        for (const field of numericFields) {
            parsed[field] = values[field] !== undefined ? Number(values[field]) : 0
        }

        onSubmit(parsed)
    }

    return (
        <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-10">
            {/* Ownership Structure */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">👥 Ownership Structure</h3>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Info size={16} className="text-blue-500" />
                        Total ownership must equal 100%
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full font-medium ${totalOwnership === 100
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                    >
                        Ownership: {totalOwnership || 0}%
                    </span>
                </div>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="border p-4 rounded-md space-y-3 bg-gray-50 relative"
                    >
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
                                    {...register(`owners.${index}.ownership`, {
                                        required: true,
                                        min: 0,
                                        max: 100,
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 mb-1 block">Income ($)</label>
                                <input
                                    type="number"
                                    {...register(`owners.${index}.income`, {
                                        required: true,
                                        min: 0,
                                    })}
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

            {/* Optional Date of Sale */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">🏁 Date of Sale (optional)</label>
                <input
                    type="date"
                    {...register('date_of_sale')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>

            {/* Optional Forecasting Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    ['wage_growth', 'Wage Growth Rate (%)'],
                    ['rental_growth', 'Rental Growth Rate (%)'],
                    ['capital_growth_rate', 'Capital Growth Rate (%)'],
                    ['buildings_value', 'Buildings Value ($)'],
                    ['fittings_value', 'Fittings Value ($)'],
                    ['inflation', 'Inflation Rate (%)'],
                    ['preferred_lvr', 'Preferred LVR (%)'],
                ].map(([name, label]) => (
                    <div key={name}>
                        <label className="block text-gray-700 font-medium mb-1">
                            {label} <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register(name)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                ))}
            </div>

            {/* Medicare Surcharge */}
            <div className="pt-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    {...register('medicare_surcharge')}
                    className="w-4 h-4 border-gray-300"
                />
                <label className="text-gray-700 font-medium">
                    Apply Medicare Levy Surcharge? (optional)
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
