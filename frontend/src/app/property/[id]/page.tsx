'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPropertyById } from '@/services/api';
import { MapPin } from 'lucide-react';

type Owner = {
    name: string;
    ownership: number;
    income: number;
};

type Property = {
    _id: string;
    title: string;
    location: string;
    state?: string;
    type?: string;
    purchase_price?: number;
    deposit?: number;
    loan_amount?: number;
    interest_rate?: number;
    loan_term?: number;
    lvr?: number;
    rent?: number;
    rentPerWeek?: number;
    weeksRented?: number;
    vacancy_rate?: number;
    date_of_purchase?: string;
    date_of_construction?: string;
    date_of_sale?: string;
    capital_growth_rate?: number;
    inflation?: number;
    preferred_lvr?: number;
    expenses?: number;
    owners?: Owner[];
    created_at?: { $date: string };
    [key: string]: any;
};

const formatCurrency = (val: any) =>
    typeof val === 'number' ? `$${val.toLocaleString()}` : val ? `$${parseFloat(val).toLocaleString()}` : 'N/A';

const formatPercent = (val: any) =>
    typeof val === 'number' ? `${val}%` : val ? `${parseFloat(val)}%` : 'N/A';

const formatDate = (val: any) => {
    try {
        if (!val) return 'N/A';
        if (typeof val === 'string') return new Date(val).toLocaleDateString();
        if (val.$date) return new Date(val.$date).toLocaleDateString();
        return 'N/A';
    } catch {
        return 'N/A';
    }
};

const displayFields: { label: string; key: keyof Property; formatter?: (val: any) => string }[] = [
    { label: 'Type', key: 'type' },
    { label: 'Purchase Price', key: 'purchase_price', formatter: formatCurrency },
    { label: 'Deposit', key: 'deposit', formatter: formatCurrency },
    { label: 'Loan Amount', key: 'loan_amount', formatter: formatCurrency },
    { label: 'Interest Rate', key: 'interest_rate', formatter: formatPercent },
    { label: 'Loan Term', key: 'loan_term' },
    { label: 'LVR', key: 'lvr', formatter: formatPercent },
    { label: 'Rent', key: 'rent', formatter: formatCurrency },
    { label: 'Rent Per Week', key: 'rentPerWeek', formatter: formatCurrency },
    { label: 'Weeks Rented', key: 'weeksRented' },
    { label: 'Vacancy Rate', key: 'vacancy_rate', formatter: formatPercent },
    { label: 'Date of Purchase', key: 'date_of_purchase', formatter: formatDate },
    { label: 'Date of Construction', key: 'date_of_construction', formatter: formatDate },
    { label: 'Date of Sale', key: 'date_of_sale', formatter: formatDate },
    { label: 'Capital Growth Rate', key: 'capital_growth_rate', formatter: formatPercent },
    { label: 'Inflation Rate', key: 'inflation', formatter: formatPercent },
    { label: 'Preferred LVR', key: 'preferred_lvr', formatter: formatPercent },
    { label: 'Expenses', key: 'expenses', formatter: formatCurrency },
    { label: 'Council Rates', key: 'council_rates', formatter: formatCurrency },
    { label: 'Insurance', key: 'insurance', formatter: formatCurrency },
    { label: 'Maintenance', key: 'maintenance', formatter: formatCurrency },
    { label: 'Property Manager', key: 'property_manager', formatter: formatCurrency },
    { label: 'Wage Growth', key: 'wage_growth', formatter: formatPercent },

    { label: 'Stamp Duty', key: 'stamp_duty', formatter: formatCurrency },
    { label: 'GST', key: 'gst', formatter: formatCurrency },
    { label: 'Legal Fees', key: 'legal_fees', formatter: formatCurrency },
    { label: 'Disbursements', key: 'disbursements', formatter: formatCurrency },
    { label: 'Building Inspection', key: 'building_inspection', formatter: formatCurrency },
    { label: 'Registration Title', key: 'registration_title', formatter: formatCurrency },

    { label: 'Mortgage Stamp Duty', key: 'mortgage_stamp_duty', formatter: formatCurrency },
    { label: 'Mortgage Insurance 1', key: 'mortgage_insurance_1', formatter: formatCurrency },
    { label: 'Stamp Duty MI 1', key: 'stamp_duty_mi_1', formatter: formatCurrency },
    { label: 'Mortgage Insurance 2', key: 'mortgage_insurance_2', formatter: formatCurrency },
    { label: 'Stamp Duty MI 2', key: 'stamp_duty_mi_2', formatter: formatCurrency },

    { label: 'Loan Application Fee', key: 'loan_app_fee', formatter: formatCurrency },
    { label: 'Valuation Fee', key: 'valuation_fee', formatter: formatCurrency },
    { label: 'Search Fees', key: 'search_fees', formatter: formatCurrency },
    { label: 'Registration Mortgage', key: 'registration_mortgage', formatter: formatCurrency },

    { label: 'Building Depreciation', key: 'buildings_value', formatter: formatCurrency },
    { label: 'Fittings Depreciation', key: 'fittings_value', formatter: formatCurrency },

    { label: 'Bookkeeping', key: 'bookkeeping', formatter: formatCurrency },
    { label: 'Once-off Expenses', key: 'once_off_expenses', formatter: formatCurrency },
    { label: 'Pest Control', key: 'pest_control', formatter: formatCurrency },
    { label: 'Postage', key: 'postage', formatter: formatCurrency },
    { label: 'Tax-Related Expenses', key: 'tax_related_expenses', formatter: formatCurrency },
    { label: 'Travel', key: 'travel', formatter: formatCurrency },
    { label: 'Cleaning', key: 'cleaning', formatter: formatCurrency },
    { label: 'Gardening', key: 'gardening', formatter: formatCurrency },
    { label: 'Land Tax', key: 'land_tax', formatter: formatCurrency },
    { label: 'Legal Expenses', key: 'legal_expenses', formatter: formatCurrency },
    { label: 'Strata', key: 'strata', formatter: formatCurrency },
    { label: 'Water', key: 'water', formatter: formatCurrency },

    { label: 'Holding Years', key: 'holding_years' },
];

export default function PropertyDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [property, setProperty] = useState<Property | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) {
                setError('Invalid property ID');
                setLoading(false);
                return;
            }

            try {
                const data = await getPropertyById(id);
                console.log('📦 Property loaded:', data);
                setProperty(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load property details');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!property) return <div className="p-6 text-gray-500">No property found.</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-2xl mt-6 dark:bg-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold mb-2">{property.title || 'Untitled Property'}</h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center mb-6">
                <MapPin className="h-4 w-4 mr-2" />
                {property.location || 'Unknown Location'} — {property.state || 'Unknown State'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-800 dark:text-gray-300">
                {displayFields.map(({ key, label, formatter }) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <p className="text-xs uppercase font-medium text-gray-500">{label}</p>
                        <p className="text-lg font-semibold">
                            {formatter ? formatter(property[key]) : property[key] ?? 'N/A'}
                        </p>
                    </div>
                ))}

                {property.owners && property.owners.length > 0 && (
                    <div className="sm:col-span-2 md:col-span-3 mt-4">
                        <h3 className="text-md font-bold mb-2">Owner Details</h3>
                        <ul className="space-y-1 list-disc pl-6 text-sm">
                            {property.owners.map((owner, i) => (
                                <li key={i}>
                                    <span className="font-semibold">{owner.name}</span> — {owner.ownership}% ownership —{' '}
                                    ${owner.income.toLocaleString()} income
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
