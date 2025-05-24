'use client'

import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import { getProperties } from "@/services/api";
import { Building, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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
          <div key={property._id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2">
            <div className="h-40 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative">
              <Building className="h-20 w-20 text-blue-200 dark:text-gray-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <span className="text-white text-sm font-medium">Investment Property</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                {property.title || 'Untitled Property'}
              </h3>

              {property.location && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{property.location}</p>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <p><strong>Weekly Rent:</strong> ${property.rent?.toLocaleString() || '0'}</p>
                <p><strong>Purchase Price:</strong> ${property.purchase_price?.toLocaleString() || '0'}</p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => router.push(`/property/${property._id}`)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-blue-900/30 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 font-medium group-hover:border-blue-300 dark:group-hover:border-blue-600"
                >
                  <Building className="h-4 w-4 mr-2" />
                  View Details
                </button>

                <button
                  onClick={() => router.push(`/tax-calculator?prefill=${property._id}`)}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 font-semibold"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Run Tax Calc
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
