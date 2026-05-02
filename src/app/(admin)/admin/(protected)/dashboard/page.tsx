"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, price, status')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setProperties(data);
    }
    setIsLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return;
    
    setDeletingId(id);
    const { error } = await supabase.from('properties').delete().eq('id', id);
    
    if (!error) {
      setProperties(properties.filter(p => p.id !== id));
    } else {
      alert("Error deleting property: " + error.message);
    }
    setDeletingId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your real estate listings and upcoming projects.</p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new"><Plus className="w-4 h-4 mr-2" /> Add Property</Link>
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap min-w-[600px]">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Property Name</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading properties...
                </td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No properties found. Click "Add Property" to create one.
                </td>
              </tr>
            ) : (
              properties.map((listing) => (
                <tr key={listing.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{listing.title}</td>
                  <td className="px-6 py-4">{listing.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      listing.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      listing.status === "sold" ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {listing.status === 'active' ? 'Active' : listing.status === 'sold' ? 'Sold' : 'Coming Soon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/properties/${listing.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 ml-2"
                    >
                      {deletingId === listing.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
