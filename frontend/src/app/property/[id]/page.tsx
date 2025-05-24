'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPropertyById } from '@/services/api';
import {
    MapPin, Calculator, Home, DollarSign, TrendingUp, Building2,
    Receipt, Shield, Users, Calendar, Percent, FileText, Sparkles,
    ArrowRight, Building, CreditCard, PieChart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const sections: {
    title: string;
    icon: any;
    color: string;
    fields: { label: string; key: string; formatter?: (val: any) => string }[];
}[] = [
        {
            title: 'Basic Information',
            icon: Home,
            color: 'blue',
            fields: [
                { label: 'Property Type', key: 'type' },
                { label: 'Title', key: 'title' },
                { label: 'Location', key: 'location' },
                { label: 'State', key: 'state' },
                { label: 'Date of Purchase', key: 'date_of_purchase', formatter: formatDate },
                { label: 'Date of Construction', key: 'date_of_construction', formatter: formatDate },
                { label: 'Date of Sale', key: 'date_of_sale', formatter: formatDate },
            ]
        },
        {
            title: 'Purchase & Loan Details',
            icon: CreditCard,
            color: 'green',
            fields: [
                { label: 'Purchase Price', key: 'purchase_price', formatter: formatCurrency },
                { label: 'Deposit', key: 'deposit', formatter: formatCurrency },
                { label: 'Loan Amount', key: 'loan_amount', formatter: formatCurrency },
                { label: 'Interest Rate', key: 'interest_rate', formatter: formatPercent },
                { label: 'Loan Term', key: 'loan_term' },
                { label: 'LVR', key: 'lvr', formatter: formatPercent },
                { label: 'Preferred LVR', key: 'preferred_lvr', formatter: formatPercent }
            ]
        },
        {
            title: 'Income & Rental Returns',
            icon: TrendingUp,
            color: 'purple',
            fields: [
                { label: 'Monthly Rent', key: 'rent', formatter: formatCurrency },
                { label: 'Rent Per Week', key: 'rentPerWeek', formatter: formatCurrency },
                { label: 'Weeks Rented', key: 'weeksRented' },
                { label: 'Vacancy Rate', key: 'vacancy_rate', formatter: formatPercent },
                { label: 'Rental Growth', key: 'rental_growth', formatter: formatPercent },
                { label: 'Capital Growth Rate', key: 'capital_growth_rate', formatter: formatPercent },
                { label: 'Inflation Rate', key: 'inflation', formatter: formatPercent }
            ]
        },
        {
            title: 'One-Time Costs',
            icon: Receipt,
            color: 'orange',
            fields: [
                { label: 'Stamp Duty', key: 'stamp_duty', formatter: formatCurrency },
                { label: 'GST', key: 'gst', formatter: formatCurrency },
                { label: 'Legal Fees', key: 'legal_fees', formatter: formatCurrency },
                { label: 'Disbursements', key: 'disbursements', formatter: formatCurrency },
                { label: 'Building Inspection', key: 'building_inspection', formatter: formatCurrency },
                { label: 'Registration Title', key: 'registration_title', formatter: formatCurrency }
            ]
        },
        {
            title: 'Mortgage Insurance',
            icon: Shield,
            color: 'red',
            fields: [
                { label: 'Mortgage Stamp Duty', key: 'mortgage_stamp_duty', formatter: formatCurrency },
                { label: 'Mortgage Insurance 1', key: 'mortgage_insurance_1', formatter: formatCurrency },
                { label: 'Stamp Duty MI 1', key: 'stamp_duty_mi_1', formatter: formatCurrency },
                { label: 'Mortgage Insurance 2', key: 'mortgage_insurance_2', formatter: formatCurrency },
                { label: 'Stamp Duty MI 2', key: 'stamp_duty_mi_2', formatter: formatCurrency }
            ]
        },
        {
            title: 'Ongoing Expenses',
            icon: FileText,
            color: 'indigo',
            fields: [
                { label: 'Council Rates', key: 'council_rates', formatter: formatCurrency },
                { label: 'Insurance', key: 'insurance', formatter: formatCurrency },
                { label: 'Maintenance', key: 'maintenance', formatter: formatCurrency },
                { label: 'Property Manager', key: 'property_manager', formatter: formatCurrency },
                { label: 'Strata', key: 'strata', formatter: formatCurrency },
                { label: 'Water', key: 'water', formatter: formatCurrency },
                { label: 'Cleaning', key: 'cleaning', formatter: formatCurrency },
                { label: 'Gardening', key: 'gardening', formatter: formatCurrency },
                { label: 'Land Tax', key: 'land_tax', formatter: formatCurrency },
                { label: 'Legal Expenses', key: 'legal_expenses', formatter: formatCurrency },
                { label: 'Postage', key: 'postage', formatter: formatCurrency },
                { label: 'Tax-Related Expenses', key: 'tax_related_expenses', formatter: formatCurrency },
                { label: 'Travel', key: 'travel', formatter: formatCurrency },
                { label: 'Bookkeeping', key: 'bookkeeping', formatter: formatCurrency },
                { label: 'Once-off Expenses', key: 'once_off_expenses', formatter: formatCurrency }
            ]
        },
        {
            title: 'Depreciation & Holding',
            icon: Building,
            color: 'teal',
            fields: [
                { label: 'Building Depreciation', key: 'buildings_value', formatter: formatCurrency },
                { label: 'Fittings Depreciation', key: 'fittings_value', formatter: formatCurrency },
                { label: 'Holding Years', key: 'holding_years' }
            ]
        }
    ];

export default function PropertyDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [property, setProperty] = useState<Property | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) {
                setError('Invalid property ID');
                setLoading(false);
                return;
            }

            try {
                const data = await getPropertyById(id);
                console.log('📦 Full Property JSON:', JSON.stringify(data, null, 2));
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-red-200 dark:border-red-800">
                    <div className="p-6 bg-red-100 dark:bg-red-900 rounded-full inline-block mb-6">
                        <Building2 className="h-16 w-16 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-4">Error Loading Property</h2>
                    <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl">
                    <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full inline-block mb-6">
                        <Building2 className="h-16 w-16 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-4">Property Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No property found with this ID.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-20 w-24 h-24 bg-white opacity-5 rounded-full animate-pulse delay-75"></div>
                    <div className="absolute top-20 right-40 w-16 h-16 bg-white opacity-5 rounded-full animate-pulse delay-150"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-8">
                            <div className="p-6 bg-white/20 rounded-2xl backdrop-blur-sm shadow-2xl border border-white/10">
                                <Building2 className="h-16 w-16" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                            {property.title || 'Property Details'}
                        </h1>
                        <div className="flex justify-center items-center text-xl md:text-2xl opacity-90 mb-8">
                            <MapPin className="h-8 w-8 mr-3" />
                            <span>{property.location || 'Unknown Location'}</span>
                            {property.state && (
                                <>
                                    <span className="mx-3">•</span>
                                    <span>{property.state}</span>
                                </>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                <Sparkles className="h-5 w-5 mr-2" />
                                Investment Property
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                <PieChart className="h-5 w-5 mr-2" />
                                Detailed Analysis
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                <TrendingUp className="h-5 w-5 mr-2" />
                                Financial Overview
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Property Sections */}
                <div className="space-y-12">
                    {sections.map((section, idx) => {
                        const Icon = section.icon;
                        const colorClasses = {
                            blue: 'from-blue-500 to-indigo-600',
                            green: 'from-green-500 to-emerald-600',
                            purple: 'from-purple-500 to-pink-600',
                            orange: 'from-orange-500 to-red-600',
                            red: 'from-red-500 to-rose-600',
                            indigo: 'from-indigo-500 to-purple-600',
                            teal: 'from-teal-500 to-cyan-600'
                        };

                        return (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className={`bg-gradient-to-r ${colorClasses[section.color as keyof typeof colorClasses]} px-8 py-8 border-b border-gray-200 dark:border-gray-600`}>
                                    <div className="flex items-center text-white">
                                        <div className="p-4 bg-white/20 rounded-2xl mr-6 shadow-lg">
                                            <Icon className="h-10 w-10" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
                                            <p className="text-lg opacity-90">
                                                {section.fields.length} data points
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {section.fields.map(({ key, label, formatter }) => {
                                            const value = property[key];
                                            const formattedValue = formatter ? formatter(value) : value ?? 'N/A';
                                            const hasValue = value !== null && value !== undefined && value !== '' && formattedValue !== 'N/A';

                                            return (
                                                <div key={key} className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${hasValue
                                                        ? 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 border-blue-200 dark:border-blue-700 shadow'
                                                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm opacity-75'
                                                    }`}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
                                                        {hasValue && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                                                    </div>
                                                    <p className={`text-base font-semibold ${hasValue
                                                            ? 'text-gray-900 dark:text-white'
                                                            : 'text-gray-400 dark:text-gray-500'
                                                        }`}>
                                                        {formattedValue}
                                                    </p>
                                                </div>

                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Owners Section */}
                {property.owners && property.owners.length > 0 && (
                    <div className="mt-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-8 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center text-white">
                                <div className="p-4 bg-white/20 rounded-2xl mr-6 shadow-lg">
                                    <Users className="h-10 w-10" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Ownership Structure</h2>
                                    <p className="text-lg opacity-90">{property.owners.length} owner(s)</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {property.owners.map((owner: Owner, i: number) => (
                                    <div key={i} className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                        <div className="flex items-center mb-6">
                                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl mr-4">
                                                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{owner.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Property Owner</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Ownership</span>
                                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{owner.ownership}%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Annual Income</span>
                                                <span className="text-lg font-bold text-green-600 dark:text-green-400">${owner.income.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="mt-16 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-12">
                        <div className="max-w-2xl mx-auto">
                            <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl mb-8">
                                <Calculator className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready for Tax Analysis?</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-lg">
                                    Use this property's data to run comprehensive tax calculations and investment projections.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (!property) return;
                                    router.push(`/tax-calculator?prefill=${property._id}`);
                                }}
                                className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-green-500/30"
                            >
                                <Calculator className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                Run Tax Calculation
                                <ArrowRight className="h-7 w-7 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}