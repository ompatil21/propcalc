'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { TrendingDown, Wallet } from 'lucide-react'

type Props = {
    data: {
        rent: number | undefined
        rentPerWeek: number | undefined
        weeksRented: number | undefined
        vacancy_rate: number | undefined
        lvr: number | undefined
        lmiRequired?: boolean
    }
    updateFields: (fields: Partial<Props['data']>) => void
    onNext: () => void
    onBack: () => void
}

export default function Step3RentalInfo({ data, updateFields, onNext, onBack }: Props) {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
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

    const rent = watch('rent')
    const weeklyRentEstimate = rent ? (Number(rent) / 4.33).toFixed(2) : ''

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 transition-all duration-300"
        >
            <h2 className="text-lg font-semibold text-gray-800">3. Rental Information</h2>

            {/* Monthly Rent */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                    <Wallet size={18} /> Monthly Rent ($)
                </label>
                <input
                    type="number"
                    {...register('rent', { required: true, min: 1 })}
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.rent ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    placeholder="e.g. 2000"
                />
                {weeklyRentEstimate && (
                    <p className="text-sm text-gray-500 mt-1">~ Weekly Rent: ${weeklyRentEstimate}</p>
                )}
                {errors.rent && <p className="text-red-500 text-sm mt-1">This field is required</p>}
            </div>

            {/* Rent Per Week */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Actual Weekly Rent ($)</label>
                <input
                    type="number"
                    {...register('rentPerWeek', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.rentPerWeek ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="e.g. 450"
                />
                {errors.rentPerWeek && <p className="text-red-500 text-sm mt-1">This field is required</p>}
            </div>

            {/* Weeks Rented */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Weeks Rented Per Year</label>
                <input
                    type="number"
                    {...register('weeksRented', { required: true, min: 0, max: 52 })}
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.weeksRented ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="e.g. 50"
                />
                {errors.weeksRented && <p className="text-red-500 text-sm mt-1">Required (0–52 weeks)</p>}
            </div>

            {/* Vacancy Rate */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                    <TrendingDown size={18} /> Vacancy Rate (%)
                </label>
                <input
                    type="number"
                    step="0.1"
                    {...register('vacancy_rate', { required: true, min: 0, max: 100 })}
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.vacancy_rate ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    placeholder="e.g. 5"
                />
                {errors.vacancy_rate && (
                    <p className="text-red-500 text-sm mt-1">Required (0–100%)</p>
                )}
            </div>

            {/* LVR */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">LVR (%)</label>
                <input
                    type="number"
                    step="any"
                    {...register('lvr', { required: true, min: 0, max: 100 })}
                    className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${errors.lvr ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                />
                {errors.lvr && <p className="text-red-500 text-sm mt-1">Enter a value between 0 and 100</p>}
            </div>

            {/* LMI Required */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">LMI Required?</label>
                <input
                    type="checkbox"
                    {...register('lmiRequired')}
                    className="mr-2"
                />
                <span className="text-sm text-gray-600">Check if LVR exceeds 80%</span>
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
