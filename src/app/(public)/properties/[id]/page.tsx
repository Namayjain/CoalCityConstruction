"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Home, MapPin, Maximize, FileText, Download, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;
  
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    async function fetchProperty() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (data && !error) {
        setProperty(data);
      }
      setIsLoading(false);
    }
    fetchProperty();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex-1 py-24 flex items-center justify-center">
        <div className="animate-pulse bg-card rounded-2xl w-full max-w-4xl h-[600px]"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex-1 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
        <Button onClick={() => router.push("/properties")}>Back to Properties</Button>
      </div>
    );
  }

  // Ensure images is an array
  const images = Array.isArray(property.images) ? property.images : [];

  const paginate = (newDirection: number) => {
    if (images.length <= 1) return;
    setDirection(newDirection);
    setCurrentImgIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;
      return next;
    });
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="flex-1 py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-8 mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">{property.type}</span>
              <span className="bg-muted text-muted-foreground px-3 py-1 text-sm font-semibold rounded-full">{property.status}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{property.title}</h1>
            <div className="flex items-center text-muted-foreground text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {property.location}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-left md:text-right"
          >
            <div className="text-3xl md:text-4xl font-bold text-foreground">{property.price}</div>
            <p className="text-muted-foreground">Estimated Pricing</p>
          </motion.div>
        </div>

        {/* Swipeable Image Gallery */}
        {images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            {/* Main Stage */}
            <div className="relative rounded-3xl overflow-hidden aspect-video md:h-[600px] w-full bg-muted group">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentImgIndex}
                  custom={direction}
                  variants={{
                    enter: (direction: number) => {
                      return { x: direction > 0 ? 1000 : -1000, opacity: 0 };
                    },
                    center: { zIndex: 1, x: 0, opacity: 1 },
                    exit: (direction: number) => {
                      return { zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 };
                    }
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  drag={images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-0 overflow-hidden"
                >
                  {/* Blurred Background Layer */}
                  <div className="absolute inset-0 z-0">
                    <Image src={images[currentImgIndex]} alt="Background" fill className="object-cover opacity-60 blur-3xl scale-110" priority />
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                  </div>
                  
                  {/* Main Contained Image Layer */}
                  <div className="absolute inset-0 z-10">
                    <Image src={images[currentImgIndex]} alt="Property" fill className="object-contain drop-shadow-2xl" priority />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <div className="absolute inset-y-0 left-4 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => paginate(-1)} className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-4 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => paginate(1)} className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-4 hide-scrollbar">
                {images.map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setDirection(idx > currentImgIndex ? 1 : -1);
                      setCurrentImgIndex(idx);
                    }}
                    className={`relative w-32 h-20 shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${idx === currentImgIndex ? 'ring-2 ring-primary scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Details & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Property Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {property.area && (
                  <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                    <div className="bg-background p-3 rounded-lg text-primary"><Maximize className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-semibold">{property.area}</p>
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                    <div className="bg-background p-3 rounded-lg text-primary"><Home className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                    <div className="bg-background p-3 rounded-lg text-primary"><Building className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </section>

            {/* Resources (Brochures / Floor Maps) */}
            {(property.brochure_url || property.floor_map_url) && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Resources & Downloads</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {property.brochure_url && (
                    <a href={property.brochure_url} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="border border-border p-6 rounded-xl flex items-center justify-between group hover:border-primary transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg text-primary"><FileText className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-semibold">Project Brochure</h3>
                            <p className="text-sm text-muted-foreground">View/Download PDF</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </a>
                  )}
                  {property.floor_map_url && (
                    <a href={property.floor_map_url} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="border border-border p-6 rounded-xl flex items-center justify-between group hover:border-primary transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-lg text-primary"><Maximize className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-semibold">Floor Plans</h3>
                            <p className="text-sm text-muted-foreground">View/Download</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Additional Details (JSONB) */}
            {property.additional_details && Object.keys(property.additional_details).length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Additional Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(property.additional_details).map(([key, value]) => (
                    <div key={key} className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="font-medium">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sticky Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Interested in this property?</h3>
              <p className="text-muted-foreground mb-6">Contact our sales team for a private viewing or more details.</p>
              
              <div className="space-y-4 mb-8">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/contact">Schedule a Visit</Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href="/contact">Request Callback</Link>
                </Button>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-full"><Phone className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call us directly</p>
                    <p className="font-semibold">+91 91 99500 255</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-full"><Mail className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email us</p>
                    <p className="font-semibold">coalcapital369@zohomail.in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
