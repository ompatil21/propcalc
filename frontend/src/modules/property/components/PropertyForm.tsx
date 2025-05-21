'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import Step1BasicInfo from './Step1BasicInfo'
import Step2Wrapper from './Step2Wrapper'
import Step3RentalInfo from './Step3RentalInfo'
import Step4Expenses from './Step4Expenses'
import Step5OwnershipIncome from './Step5OwnershipIncome'
import { createProperty } from '@/services/api'

type Owner = {
    name: string
    ownership: number | undefined
    income: number | undefined
}

type PropertyFormData = {
    title: string
    location: string
    type: string
    state: string
    date_of_purchase: string
    date_of_construction: string
    purchase_price: number | undefined
    deposit: number | undefined
    loan_amount: number | undefined
    interest_rate: number | undefined
    loan_term: number | undefined
    rent: number | undefined
    rentPerWeek: number | undefined
    weeksRented: number | undefined
    vacancy_rate: number | undefined
    lvr: number | undefined
    council_rates: number | undefined
    insurance: number | undefined
    maintenance: number | undefined
    property_manager: number | undefined
    owners: Owner[]
    wage_growth: number | undefined
    rental_growth?: number
    capital_growth_rate?: number
    buildings_value?: number
    fittings_value?: number
    inflation?: number
    preferred_lvr?: number
    medicare_surcharge?: boolean
    date_of_sale?: string
}

export default function PropertyForm() {
    const [step, setStep] = useState<number>(1)
    const [formData, setFormData] = useState<PropertyFormData>({
        title: '',
        location: '',
        type: '',
        state: '',
        date_of_purchase: '',
        date_of_construction: '',
        purchase_price: undefined,
        deposit: undefined,
        loan_amount: undefined,
        interest_rate: undefined,
        loan_term: undefined,
        rent: undefined,
        rentPerWeek: undefined,
        weeksRented: undefined,
        vacancy_rate: undefined,
        lvr: undefined,
        council_rates: undefined,
        insurance: undefined,
        maintenance: undefined,
        property_manager: undefined,
        owners: [{ name: '', ownership: undefined, income: undefined }],
        wage_growth: undefined,
        rental_growth: undefined,
        capital_growth_rate: undefined,
        buildings_value: undefined,
        fittings_value: undefined,
        inflation: undefined,
        preferred_lvr: undefined,
        medicare_surcharge: false,
        date_of_sale: ''
    })

    const router = useRouter()

    const updateFields = (fields: Partial<PropertyFormData>) => {
        setFormData(prev => ({ ...prev, ...fields }))
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Sidebar */}
                <div className="w-full md:w-1/3 bg-blue-700 text-white p-6 relative">
                    <h3 className="uppercase text-sm font-bold mb-8 tracking-widest">Step {step} of 5</h3>
                    <ul className="space-y-6 text-sm font-medium">
                        {['Basic Info', 'Purchase', 'Rental Info', 'Expenses', 'Ownership'].map((label, index) => (
                            <li key={label} className={`${step === index + 1 ? 'text-white font-bold' : 'text-blue-200'}`}>
                                <span className="inline-block w-5 h-5 mr-2 rounded-full border-2 border-white text-xs text-center">
                                    {index + 1}
                                </span>
                                {label}
                            </li>
                        ))}
                    </ul>
                    <div className="absolute bottom-6 left-6 right-6 h-2 bg-blue-300 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${(step / 5) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Panel */}
                <div className="w-full md:w-2/3 p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Property</h2>

                    {step === 1 && (
                        <Step1BasicInfo
                            data={formData}
                            updateFields={updateFields}
                            onSuccess={() => setStep(2)}
                        />
                    )}

                    {step === 2 && (
                        <Step2Wrapper
                            data={formData}
                            updateFields={updateFields}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    )}

                    {step === 3 && (
                        <Step3RentalInfo
                            data={formData}
                            updateFields={updateFields}
                            onNext={() => setStep(4)}
                            onBack={() => setStep(2)}
                        />
                    )}

                    {step === 4 && (
                        <Step4Expenses
                            data={{
                                council_rates: formData.council_rates,
                                insurance: formData.insurance,
                                maintenance: formData.maintenance,
                                property_manager: formData.property_manager
                            }}
                            updateFields={updateFields}
                            onBack={() => setStep(3)}
                            onNext={() => setStep(5)}
                        />
                    )}

                    {step === 5 && (
                        <Step5OwnershipIncome
                            data={formData}
                            updateFields={updateFields}
                            onBack={() => setStep(4)}
                            onSubmit={async (finalStepData) => {
                                try {
                                    const fullPayload = {
                                        ...formData,        // Steps 1–4
                                        ...finalStepData    // Step 5 additions
                                    }

                                    console.log("🚀 SENDING TO BACKEND:", fullPayload)
                                    await createProperty(fullPayload)

                                    toast({
                                        title: 'Property Added',
                                        description: 'Your property has been successfully saved!',
                                        variant: 'default'
                                    })

                                    setTimeout(() => {
                                        router.push('/dashboard')
                                    }, 1000)
                                } catch (err) {
                                    console.error("❌ Submission failed:", err)
                                    toast({
                                        title: 'Error',
                                        description: 'Submission failed. Please check your input.',
                                        variant: 'destructive'
                                    })
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
