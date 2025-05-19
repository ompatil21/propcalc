'use client'

import { useState } from 'react'
import Step2APurchaseLoan from './Step2APurchaseLoan'
import Step2BCostBreakdown from './Step2BCostBreakdown'

type Props = {
    data: any
    updateFields: (fields: Partial<any>) => void
    onNext: () => void
    onBack: () => void
}

export default function Step2Wrapper({ data, updateFields, onNext, onBack }: Props) {
    const [subStep, setSubStep] = useState<1 | 2>(1)

    return (
        <>
            {subStep === 1 ? (
                <Step2APurchaseLoan
                    data={data}
                    updateFields={updateFields}
                    onNext={() => setSubStep(2)}
                    onBack={onBack}
                />
            ) : (
                <Step2BCostBreakdown
                    data={data}
                    updateFields={updateFields}
                    onNext={onNext}
                    onBack={() => setSubStep(1)}
                />
            )}
        </>
    )
}
