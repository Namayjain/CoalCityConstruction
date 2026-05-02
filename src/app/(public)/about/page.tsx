"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex-1 py-12 md:py-24">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            About Coal City Construction
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            Pioneering modern living spaces with a commitment to architectural brilliance, sustainability, and unparalleled luxury.
          </motion.p>
        </div>

        {/* Our Story - Centered without picture */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-32 bg-card p-10 md:p-16 rounded-[2rem] border border-border/50 shadow-sm"
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-light">
            <p>
              Founded on the principles of integrity and excellence, Coal City Construction Pvt. Ltd. has grown from a boutique agency into a leading force in the real estate sector.
            </p>
            <p>
              We believe that a home is more than just a physical space; it's a sanctuary, an investment, and a legacy. That's why we obsess over every detail, from the foundation to the finishing touches. Our dedication to quality ensures that every project we deliver stands the test of time.
            </p>
          </div>
        </motion.div>

        {/* Leadership Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Leadership</h2>
          <p className="text-muted-foreground">Meet the visionaries behind Coal City Construction.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
          {/* Director 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm group"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image 
                src="/images/Director Pic.webp" 
                alt="Braj Bhushan" 
                fill 
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-1">Braj Bhushan</h3>
              <p className="text-primary font-medium mb-4 uppercase tracking-widest text-sm">Director</p>
              <p className="text-muted-foreground leading-relaxed text-sm font-light">
                Driving the strategic vision of Coal City Construction with decades of industry expertise and a passion for architectural innovation.
              </p>
            </div>
          </motion.div>

          {/* Director 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm group"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image 
                src="/images/Director Pic1.webp" 
                alt="Rahul Singh" 
                fill 
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-1">Rahul Singh</h3>
              <p className="text-primary font-medium mb-4 uppercase tracking-widest text-sm">Director</p>
              <p className="text-muted-foreground leading-relaxed text-sm font-light">
                Leading operational excellence and project execution, ensuring every development meets our uncompromising standards of quality.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
