"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, UploadCloud, Loader2, X, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Select",
    price: "",
    location: "",
    description: "",
    area: "",
    bhk: "",
    bathrooms: "",
    status: "active",
  });

  const [detailsList, setDetailsList] = useState<{key: string, value: string}[]>([]);

  // Existing images from DB
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // New images added by user
  const [newImages, setNewImages] = useState<File[]>([]);
  
  const [brochure, setBrochure] = useState<File | null>(null);
  const [floorMap, setFloorMap] = useState<File | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (data && !error) {
        setFormData({
          title: data.title,
          propertyType: data.type,
          price: data.price,
          location: data.location,
          description: data.description || "",
          area: data.area || "",
          bhk: data.bedrooms || "",
          bathrooms: data.bathrooms || "",
          status: data.status,
        });

        setExistingImages(data.images || []);

        if (data.additional_details) {
          const formattedDetails = Object.entries(data.additional_details).map(([key, value]) => ({
            key,
            value: String(value)
          }));
          setDetailsList(formattedDetails);
        }
      } else {
        setError("Could not load property details.");
      }
      setIsLoading(false);
    }
    
    if (propertyId) fetchProperty();
  }, [propertyId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDetail = () => setDetailsList([...detailsList, { key: "", value: "" }]);
  
  const handleDetailChange = (index: number, field: 'key' | 'value', value: string) => {
    const newList = [...detailsList];
    newList[index][field] = value;
    setDetailsList(newList);
  };

  const handleRemoveDetail = (index: number) => setDetailsList(detailsList.filter((_, i) => i !== index));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeExistingImage = (index: number) => setExistingImages(existingImages.filter((_, i) => i !== index));
  const removeNewImage = (index: number) => setNewImages(newImages.filter((_, i) => i !== index));

  const uploadFile = async (file: File, pathPrefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from('property-media').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('property-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.propertyType === "Select") return setError("Please select a property type.");
    if (existingImages.length === 0 && newImages.length === 0) return setError("Please have at least one property image.");

    const additionalDetailsObj = detailsList.reduce((acc, curr) => {
      if (curr.key && curr.value) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    setIsSubmitting(true);

    try {
      // 1. Upload NEW Images
      const newImageUrls: string[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const url = await uploadFile(newImages[i], 'image');
        newImageUrls.push(url);
      }

      // Combine existing images that weren't deleted with the new ones
      const finalImages = [...existingImages, ...newImageUrls];

      // 2. Upload new Brochure if exists (we don't delete the old one automatically here to save complexity, it just overwrites the DB reference)
      let brochureUrl = undefined; // undefined means don't update this column unless we have a new file
      if (brochure) brochureUrl = await uploadFile(brochure, 'brochure');

      // 3. Upload new Floor Map if exists
      let floorMapUrl = undefined;
      if (floorMap) floorMapUrl = await uploadFile(floorMap, 'floormap');

      // 4. Update DB
      const updateData: any = {
        title: formData.title,
        location: formData.location,
        price: formData.price,
        type: formData.propertyType,
        status: formData.status,
        description: formData.description,
        area: formData.area || null,
        bedrooms: formData.bhk || null,
        bathrooms: formData.bathrooms || null,
        images: finalImages,
        additional_details: additionalDetailsObj
      };

      if (brochureUrl !== undefined) updateData.brochure_url = brochureUrl;
      if (floorMapUrl !== undefined) updateData.floor_map_url = floorMapUrl;

      const { error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId);

      if (updateError) throw updateError;

      router.push("/admin/dashboard");
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="py-24 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/admin/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground">Update your real estate listing.</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold border-b border-border/50 pb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Property Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                <option value="Plot">Plot / Land</option>
                <option value="Flat">Flat / Apartment</option>
                <option value="House">House / Villa</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input type="text" name="price" value={formData.price} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required />
            </div>
          </div>
        </div>

        {/* Details & Status */}
        <AnimatePresence>
          {formData.propertyType !== "Select" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            >
              <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-semibold border-b border-border/50 pb-4">Details & Status</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {formData.propertyType === "Plot" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Plot Area (Sq. ft)</label>
                      <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                    </div>
                  )}
                  {(formData.propertyType === "Flat" || formData.propertyType === "House") && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Area (Sq. ft)</label>
                        <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">BHK</label>
                        <select name="bhk" value={formData.bhk} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                          <option value="1">1 BHK</option>
                          <option value="2">2 BHK</option>
                          <option value="3">3 BHK</option>
                          <option value="4">4 BHK</option>
                          <option value="5+">5+ BHK</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bathrooms</label>
                        <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="active">Active</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media */}
        <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold border-b border-border/50 pb-4">Media & Documents</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-medium">Property Images <span className="text-destructive ml-1">*</span></label>
              
              {/* Image Previews */}
              {(existingImages.length > 0 || newImages.length > 0) && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {existingImages.map((img, idx) => (
                    <div key={`exist-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                      <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                      <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newImages.map((img, idx) => (
                    <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border ring-2 ring-primary">
                      <Image src={URL.createObjectURL(img)} alt={`New ${idx}`} fill className="object-cover" />
                      <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-border/50 rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors relative group">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <UploadCloud className="w-8 h-8 mb-3 group-hover:text-primary transition-colors" />
                <p className="font-medium mb-1">Upload or Drag More Images</p>
                <p className="text-xs opacity-80">Images will be appended to your list above.</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Replace Brochure</label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors relative group">
                <input type="file" accept="image/*,.pdf" onChange={(e) => setBrochure(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <UploadCloud className="w-6 h-6 mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium mb-1">{brochure ? brochure.name : 'Upload New Brochure'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Replace Floor Map</label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors relative group">
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFloorMap(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <UploadCloud className="w-6 h-6 mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium mb-1">{floorMap ? floorMap.name : 'Upload New Floor Map'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Details */}
        <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="text-xl font-semibold">Additional Details</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddDetail}>
              <Plus className="w-4 h-4 mr-2" /> Add Detail
            </Button>
          </div>
          <div className="space-y-4">
            {detailsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No additional details added.</p>
            ) : (
              detailsList.map((detail, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-1">
                    <input type="text" placeholder="Name (e.g., Parking)" value={detail.key} onChange={(e) => handleDetailChange(index, 'key', e.target.value)} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div className="flex-[2] space-y-1">
                    <input type="text" placeholder="Value (e.g., 2 Cars Covered)" value={detail.value} onChange={(e) => handleDetailChange(index, 'value', e.target.value)} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveDetail(index)} className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild disabled={isSubmitting}>
            <Link href="/admin/dashboard">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Updates...</> : <><Save className="w-4 h-4 mr-2" /> Save Updates</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
