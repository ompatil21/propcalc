'use client'

import { useForm } from 'react-hook-form'
import { Home, MapPin, Building, DollarSign, CalendarDays } from 'lucide-react'

type Props = {
    data: {
        title: string
        location: string
        type: string
        state: string
        askingPrice: number
        deposit: number
        rentPerWeek: number
        weeksRented: number
        lvr: number
        lmiRequired?: boolean
    }
    updateFields: (fields: Partial<Props['data']>) => void
    onSuccess: () => void
}

export default function Step1BasicInfo({ data, updateFields, onSuccess }: Props) {
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
        onSuccess()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all duration-300">
            {/* Property Name */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                    <Home size={18} /> Property Name
                </label>
                <input
                    {...register('title', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                    placeholder="e.g. Cozy Beach Apartment"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">This field is required</p>}
            </div>

            {/* Location */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                    <MapPin size={18} /> Location
                </label>
                <input
                    {...register('location', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                    placeholder="e.g. Melbourne, VIC"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">This field is required</p>}
            </div>

            {/* Property Type */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                    <Building size={18} /> Property Type
                </label>
                <select
                    {...register('type', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                >
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Townhouse">Townhouse</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">This field is required</p>}
            </div>

            {/* State of Purchase */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">State of Purchase</label>
                <select
                    {...register('state', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.state ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                >
                    <option value="">Select state</option>
                    <option value="VIC">VIC</option>
                    <option value="NSW">NSW</option>
                    <option value="QLD">QLD</option>
                    <option value="WA">WA</option>
                    <option value="SA">SA</option>
                    <option value="TAS">TAS</option>
                    <option value="NT">NT</option>
                    <option value="ACT">ACT</option>
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">Required</p>}
            </div>

            {/* Asking Price */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Asking Property Value ($)</label>
                <input
                    type="number"
                    step="any"
                    {...register('askingPrice', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.askingPrice ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                    placeholder="e.g. 400000"
                />
                {errors.askingPrice && <p className="text-red-500 text-sm mt-1">Required</p>}
            </div>

            {/* Deposit */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Deposit ($)</label>
                <input
                    type="number"
                    step="any"
                    {...register('deposit', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.deposit ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                />
                {errors.deposit && <p className="text-red-500 text-sm mt-1">Required</p>}
            </div>

            {/* Rent Per Week */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Rent Per Week ($)</label>
                <input
                    type="number"
                    step="any"
                    {...register('rentPerWeek', { required: true })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.rentPerWeek ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                />
                {errors.rentPerWeek && <p className="text-red-500 text-sm mt-1">Required</p>}
            </div>

            {/* Weeks Rented */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">Weeks Rented Per Year</label>
                <input
                    type="number"
                    {...register('weeksRented', { required: true, min: 0, max: 52 })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.weeksRented ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                />
                {errors.weeksRented && <p className="text-red-500 text-sm mt-1">Must be between 0 and 52</p>}
            </div>

            {/* LVR */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">LVR (%)</label>
                <input
                    type="number"
                    step="any"
                    {...register('lvr', { required: true, min: 0, max: 100 })}
                    className={`w-full border rounded-md px-4 py-2 ${errors.lvr ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                />
                {errors.lvr && <p className="text-red-500 text-sm mt-1">Enter a percentage between 0–100</p>}
            </div>

            {/* LMI Placeholder */}
            <div>
                <label className="block text-gray-700 font-semibold mb-1">LMI Required?</label>
                <input
                    type="checkbox"
                    {...register('lmiRequired')}
                    className="mr-2"
                />
                <span className="text-sm text-gray-600">Check if LVR exceeds 80%</span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={!isValid}
                    className={`px-6 py-2 rounded-md text-white font-semibold shadow-sm transition ${isValid
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    Next →
                </button>
            </div>
        </form>
    )
}
