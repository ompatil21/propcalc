'use client'

import { useForm } from 'react-hook-form'
import { Home, MapPin, Building, CalendarDays } from 'lucide-react'

type Props = {
    data: {
        title: string
        location: string
        type: string
        state: string
        date_of_purchase: string
        date_of_construction: string
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 transition-all duration-300">

            {/* Group 1: Property Identification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                        <Home size={18} /> Property Name
                    </label>
                    <input
                        {...register('title', { required: true })}
                        className={`w-full border rounded-md px-4 py-2 ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                        placeholder="e.g. Cozy Beach Apartment"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                        <MapPin size={18} /> Location
                    </label>
                    <input
                        {...register('location', { required: true })}
                        className={`w-full border rounded-md px-4 py-2 ${errors.location ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                        placeholder="e.g. Melbourne"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>

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
                    {errors.type && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">State</label>
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
            </div>

            {/* Group 2: Property Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                        <CalendarDays size={18} /> Date of Construction
                    </label>
                    <input
                        type="date"
                        {...register('date_of_construction', { required: true })}
                        className={`w-full border rounded-md px-4 py-2 ${errors.date_of_construction ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                    />
                    {errors.date_of_construction && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
                        <CalendarDays size={18} /> Date of Purchase
                    </label>
                    <input
                        type="date"
                        {...register('date_of_purchase', { required: true })}
                        className={`w-full border rounded-md px-4 py-2 ${errors.date_of_purchase ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:outline-none`}
                    />
                    {errors.date_of_purchase && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6">
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
