"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Paperclip, Mail, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setContacts(data);
    }
    setIsLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    setDeletingId(id);
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    
    if (!error) {
      setContacts(contacts.filter(c => c.id !== id));
    } else {
      alert("Error deleting contact: " + error.message);
    }
    setDeletingId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Contacts</h1>
          <p className="text-muted-foreground">Manage incoming inquiries and leads from the public site.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
          Total Leads: {contacts.length}
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading leads...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-card border border-border/50 rounded-xl p-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No leads yet</h3>
            <p className="text-muted-foreground">When someone fills out the contact form, it will appear here.</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-muted/50 px-6 py-4 border-b border-border/50 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline text-sm flex items-center">
                    <Mail className="w-3 h-3 mr-1" /> {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{new Date(contact.created_at).toLocaleString()}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(contact.id)}
                    disabled={deletingId === contact.id}
                    className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    {deletingId === contact.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed mb-6">
                  {contact.message}
                </p>

                {(contact.budget || contact.timeline || (contact.documents && contact.documents.length > 0)) && (
                  <div className="bg-muted/30 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border border-border/30">
                    {contact.budget && (
                      <div className="flex items-start">
                        <DollarSign className="w-5 h-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Budget</p>
                          <p className="text-sm font-medium">{contact.budget}</p>
                        </div>
                      </div>
                    )}
                    {contact.timeline && (
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Timeline</p>
                          <p className="text-sm font-medium">{contact.timeline}</p>
                        </div>
                      </div>
                    )}
                    {contact.documents && contact.documents.length > 0 && (
                      <div className="flex items-start md:col-span-1">
                        <Paperclip className="w-5 h-5 text-primary mr-2 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Attachments</p>
                          <div className="flex flex-col gap-1 mt-1">
                            {contact.documents.map((doc: string, idx: number) => (
                              <a 
                                key={idx} 
                                href={doc} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline truncate max-w-[150px] md:max-w-[200px]"
                              >
                                View Document {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
