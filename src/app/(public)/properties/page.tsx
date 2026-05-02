"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PropertyCard, PropertyData } from "@/components/ui/property-card";
import { supabase } from "@/lib/supabase";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setProperties(data as PropertyData[]);
      }
      setIsLoading(false);
    }
    fetchProperties();
  }, []);

  return (
    <div className="flex-1 py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Properties</h1>
            <p className="text-lg text-muted-foreground">Discover our exclusive collection of premium real estate, curated for those who demand nothing but the best.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{properties.length} Listings</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
            {/* Skeletons */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl h-[450px]"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            No properties found. Please check back later.
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.map((property) => (
              <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
