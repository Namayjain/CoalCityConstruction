"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, UploadCloud, ChevronDown, ChevronUp, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [showAdditional, setShowAdditional] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
    timeline: ""
  });

  const [documents, setDocuments] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out the required fields (Name, Email, Message).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload optional documents
      const documentUrls: string[] = [];
      for (let i = 0; i < documents.length; i++) {
        const file = documents[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `contact-doc-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property-media') // Re-using this public bucket for ease, or use a dedicated one
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('property-media').getPublicUrl(fileName);
        documentUrls.push(data.publicUrl);
      }

      // 2. Insert into DB
      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          budget: formData.budget || null,
          timeline: formData.timeline || null,
          documents: documentUrls
        });

      if (insertError) throw insertError;

      setIsSuccess(true);
      
    } catch (err: any) {
      setError(err.message || "An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 py-24 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-border/50 p-8 rounded-3xl text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for reaching out, {formData.name.split(' ')[0]}. Our team will review your inquiry and get back to you shortly.
          </p>
          <Button onClick={() => window.location.reload()} size="lg" className="w-full">
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-12 md:py-24">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Have a question or interested in a property? Our team is here to assist you.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 mr-4 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Headquarters</h3>
                  <p className="text-muted-foreground">123 Coal City Boulevard<br />Metropolis, MC 10012</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 mr-4 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-muted-foreground">+91 91 99500 255</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 mr-4 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-muted-foreground">rahulss0014@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/50 p-8 rounded-3xl shadow-xl relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 z-0" />

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                  <input 
                    type="text" id="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full flex h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-destructive">*</span></label>
                  <input 
                    type="email" id="email" value={formData.email} onChange={handleInputChange} required
                    className="w-full flex h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              {/* Toggle for Additional Fields Drawer */}
              <button
                type="button"
                onClick={() => setShowAdditional(!showAdditional)}
                className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {showAdditional ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                {showAdditional ? "Hide Additional Fields" : "Add More Details (Budget, Timeline)"}
              </button>

              <AnimatePresence>
                {showAdditional && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                    animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
                    exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                    className="pt-2 pb-2 border-l-2 border-primary/50 pl-4 ml-2 space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium text-muted-foreground">Estimated Budget (Optional)</label>
                        <select 
                          id="budget" value={formData.budget} onChange={handleInputChange}
                          className="w-full flex h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-muted-foreground"
                        >
                          <option value="">Select Range</option>
                          <option value="Under ₹50 Lakhs">Under ₹50 Lakhs</option>
                          <option value="₹50 Lakhs - ₹1 Cr">₹50 Lakhs - ₹1 Cr</option>
                          <option value="₹1 Cr - ₹3 Cr">₹1 Cr - ₹3 Cr</option>
                          <option value="Above ₹3 Cr">Above ₹3 Cr</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="timeline" className="text-sm font-medium text-muted-foreground">Purchase Timeline (Optional)</label>
                        <select 
                          id="timeline" value={formData.timeline} onChange={handleInputChange}
                          className="w-full flex h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-muted-foreground"
                        >
                          <option value="">Select Timeline</option>
                          <option value="Immediate">Immediate</option>
                          <option value="1-3 Months">1-3 Months</option>
                          <option value="3-6 Months">3-6 Months</option>
                          <option value="Just Exploring">Just Exploring</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground">Reference Images / Documents (Optional)</label>
                      
                      {documents.length > 0 && (
                        <div className="flex flex-col gap-2 mb-2">
                          {documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm border border-border">
                              <span className="truncate pr-4">{doc.name}</span>
                              <button type="button" onClick={() => removeDocument(idx)} className="text-muted-foreground hover:text-destructive shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:bg-muted/50 transition-colors relative cursor-pointer group">
                        <input 
                          type="file" multiple onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <UploadCloud className="w-6 h-6 mx-auto text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                        <p className="text-sm text-muted-foreground">Click to append files</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2 pt-2">
                <label htmlFor="message" className="text-sm font-medium">Message <span className="text-destructive">*</span></label>
                <textarea 
                  id="message" value={formData.message} onChange={handleInputChange} required
                  className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                  placeholder="How can we help you?"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base rounded-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                ) : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
