"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building, MapPin, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ComingSoonPage() {
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComingSoon() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'coming_soon')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setUpcomingProjects(data);
      }
      setIsLoading(false);
    }
    fetchComingSoon();
  }, []);

  return (
    <div className="flex-1 py-12 md:py-24">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="max-w-2xl mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Future Developments
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            A sneak peek into what we are building. These exclusive properties will be available soon.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : upcomingProjects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <h3 className="text-xl font-semibold mb-2">No upcoming projects right now.</h3>
            <p className="text-muted-foreground">We are constantly acquiring new lands. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingProjects.map((project, index) => {
              const expectedCompletion = project.additional_details?.['expected_completion'] || "TBA";
              const coverImage = project.images?.[0] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

              return (
                <Link href={`/properties/${project.id}`} key={project.id} className="block">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative rounded-xl overflow-hidden border border-border/50 bg-card hover:border-border transition-colors flex flex-col h-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      <div className="absolute inset-0 bg-background/20 z-10" />
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                        style={{ backgroundImage: `url('${coverImage}')` }} 
                      />
                      <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full flex items-center border border-border/50">
                        <Clock className="w-3 h-3 mr-1" /> Coming Soon
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <div className="flex items-center text-muted-foreground mb-4 text-sm flex-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {project.location}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                        <span className="text-sm font-medium text-muted-foreground flex items-center">
                          <Building className="h-4 w-4 mr-1" /> {project.type}
                        </span>
                        <div className="text-sm font-semibold text-amber-500">
                          Est: {expectedCompletion}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
