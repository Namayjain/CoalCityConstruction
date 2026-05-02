"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Trophy } from "lucide-react";
import { PropertyCard, PropertyData } from "@/components/ui/property-card";
import { supabase } from "@/lib/supabase";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80",
];

const marqueeText = [
  "Luxury Living", "Premium Land", "Modern Construction", "High-End Aesthetics", "Architectural Brilliance", "Exclusive Communities"
];

// Shared animations
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    }
  },
  viewport: { once: true, margin: "-50px" }
};

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<PropertyData[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Parallax Scroll setup
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const yText = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    // Fetch Properties
    async function fetchProperties() {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (data) setFeaturedProperties(data as PropertyData[]);
    }
    fetchProperties();

    // Hero Slider Interval
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative flex items-center justify-center min-h-[95vh] overflow-hidden bg-black">
        {/* Background Image Slider with Parallax */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image 
                src={HERO_IMAGES[currentHeroIndex]}
                alt="Luxury Architecture"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          {/* Elegant Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
        </motion.div>

        {/* Glassmorphism Content Box */}
        <div className="container relative z-20 px-4 md:px-8 flex justify-center mt-16">
          <motion.div 
            style={{ y: yText, opacity: opacityText }}
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-[2rem] text-center max-w-4xl w-full shadow-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-white/10 text-white/90 px-5 py-2 rounded-full mb-8 border border-white/5"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium tracking-widest uppercase">Premium Real Estate</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 drop-shadow-2xl">
              <span className="text-white block mb-2">Elevating the</span>
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Standard of Living
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Discover unparalleled luxury, architectural brilliance, and exclusive communities tailored for the modern elite.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button size="lg" asChild className="group text-base bg-amber-500 text-black hover:bg-amber-400 h-14 px-8 rounded-full border-none shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Link href="/properties">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base h-14 px-8 bg-white/5 text-white border-white/20 hover:bg-white/20 rounded-full">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Scrolling Marquee */}
      <div className="bg-background text-foreground py-6 overflow-hidden border-y border-border/50 flex relative z-30">
        <motion.div 
          className="flex whitespace-nowrap gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {[...marqueeText, ...marqueeText, ...marqueeText].map((text, i) => (
            <div key={i} className="flex items-center text-xl md:text-2xl font-light uppercase tracking-widest opacity-70">
              <span className="mx-6 text-amber-500 text-sm">◆</span>
              {text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. Modern Bento Grid "Our Story" */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="container px-4 md:px-8 mx-auto">
          <motion.div 
            variants={fadeInUp} initial="initial" whileInView="whileInView"
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">A Legacy of Excellence</h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              We don't just build properties; we craft legacies. Experience the zenith of architectural innovation and uncompromising quality.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="initial" whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {/* Large Image Box */}
            <motion.div 
              variants={fadeInUp}
              className="md:col-span-2 relative rounded-[2rem] overflow-hidden aspect-video md:aspect-auto md:h-[450px] group border border-border/30 bg-muted"
            >
              <Image 
                src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern Architecture" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-10 flex flex-col justify-end">
                <h3 className="text-3xl font-bold text-white mb-3">Pioneering Design</h3>
                <p className="text-white/80 max-w-md text-lg font-light">Every project is a testament to our unwavering commitment to quality and aesthetic superiority.</p>
              </div>
            </motion.div>

            {/* Logo Box */}
            <motion.div 
              variants={fadeInUp}
              className="relative rounded-[2rem] overflow-hidden aspect-square md:aspect-auto md:h-[450px] bg-white border border-border/30 p-12 flex flex-col items-center justify-center group shadow-xl"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                  src="/icon.jpeg" 
                  alt="Coal City Logo" 
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Stats Box 1 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-card border border-border/30 rounded-[2rem] p-10 flex flex-col justify-center items-center text-center group hover:bg-muted/50 transition-colors"
            >
              <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="text-5xl font-bold mb-3">20+</div>
              <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Years of Trust</div>
            </motion.div>

            {/* Stats Box 2 */}
            <motion.div 
              variants={fadeInUp}
              className="md:col-span-2 bg-zinc-900 dark:bg-card border border-border/30 text-white rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/30 transition-colors duration-700" />
              
              <div className="relative z-10">
                <Trophy className="w-10 h-10 mb-6 text-amber-500" />
                <h3 className="text-4xl font-bold mb-4">150+ Premium Projects</h3>
                <p className="text-white/70 max-w-md text-lg font-light leading-relaxed">Delivered across the country, transforming skylines and setting new benchmarks in luxury living.</p>
              </div>
              <Button size="lg" variant="secondary" asChild className="relative z-10 shrink-0 rounded-full h-14 px-8 text-base bg-white text-black hover:bg-white/90">
                <Link href="/about">Read Our Legacy</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. Featured Properties Section */}
      <section className="py-32 bg-muted/20 border-t border-border/30">
        <div className="container px-4 md:px-8 mx-auto">
          <motion.div 
            variants={fadeInUp} initial="initial" whileInView="whileInView"
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Curated Portfolio</h2>
              <p className="text-xl text-muted-foreground font-light">Explore our most sought-after listings. Handpicked for the discerning few.</p>
            </div>
            <Button size="lg" asChild className="group rounded-full h-14 px-8 bg-background border border-border hover:bg-muted text-foreground">
              <Link href="/properties">
                View Collection <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {featuredProperties.length > 0 ? (
            <motion.div 
              variants={staggerContainer} initial="initial" whileInView="whileInView"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {featuredProperties.map((property) => (
                <motion.div key={property.id} variants={fadeInUp}>
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 opacity-50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-card rounded-3xl h-[500px]"></div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
