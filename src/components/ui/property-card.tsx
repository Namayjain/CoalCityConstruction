"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Home, MapPin, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface PropertyData {
  id: string | number;
  title: string;
  location: string;
  price: string;
  type: "Plot" | "Flat" | "House" | "Villa";
  status: string;
  images: string[];
  area?: string;
  bedrooms?: number;
  bathrooms?: number;
}

interface PropertyCardProps {
  property: PropertyData;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-xl overflow-hidden border border-border/50 bg-card hover:border-border transition-colors flex flex-col h-full"
    >
      <Link href={`/properties/${property.id}`} className="block aspect-[4/3] overflow-hidden bg-muted relative group-hover:opacity-90 transition-opacity">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${property.images[currentImageIndex]}')` }}
          />
        </AnimatePresence>

        {property.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur rounded-full p-1.5 transition-colors z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur rounded-full p-1.5 transition-colors z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
              {property.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full z-10">
          {property.status}
        </div>
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground backdrop-blur px-3 py-1 text-xs font-semibold rounded-full z-10">
          {property.type}
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <div className="flex items-center text-muted-foreground mb-4 text-sm flex-1">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          {property.location}
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <span className="text-lg font-bold">{property.price}</span>
          <div className="flex space-x-3 text-sm text-muted-foreground">
            {property.area && (
              <span className="flex items-center"><Maximize className="h-4 w-4 mr-1"/> {property.area}</span>
            )}
            {property.bedrooms !== undefined && (
              <span className="flex items-center"><Home className="h-4 w-4 mr-1"/> {property.bedrooms}</span>
            )}
            {property.bathrooms !== undefined && (
              <span className="flex items-center"><Building className="h-4 w-4 mr-1"/> {property.bathrooms}</span>
            )}
          </div>
        </div>
        <Button className="w-full mt-4 group" variant={property.status === "Sold" ? "outline" : "default"} disabled={property.status === "Sold"} asChild={property.status !== "Sold"}>
          {property.status === "Sold" ? (
            <span>Unavailable</span>
          ) : (
            <Link href={`/properties/${property.id}`}>View Details</Link>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
