'use client';

import Link from 'next/link';
import { Property } from '@/types/property';

type Props = {
    property: Property;
};

export default function PropertyCard({ property }: Props) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{property.title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Location: {property.location}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Type: {property.type}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">State: {property.state}</p>
            <div className="mt-4">
                <Link
                    href={`/property/${property._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}
