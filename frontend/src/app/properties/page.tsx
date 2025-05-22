// src/app/properties/page.tsx
'use client'

import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import { getProperties } from "@/services/api";
import PropertyCard from "@/components/ui/PropertyCard";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) throw new Error('User email not found');
        const data = await getProperties(email);
        setProperties(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">My Properties</h1>

      {loading && <p className="text-gray-600 dark:text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {properties.length === 0 && !loading && !error && (
        <p className="text-gray-500 dark:text-gray-400">No properties found. Add your first property.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
}
