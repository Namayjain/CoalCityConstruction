"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, LayoutDashboard, PlusCircle, LogOut, Menu, X, Users } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-card border-b border-border/50">
        <Link href="/" className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span className="font-bold">Coal City Admin</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop Fixed, Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border/50 flex flex-col transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-border/50">
          <Link href="/" className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span className="font-bold">Coal City Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            href="/admin/dashboard" 
            onClick={closeMobileMenu}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              pathname === "/admin/dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/admin/properties/new" 
            onClick={closeMobileMenu}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              pathname === "/admin/properties/new" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
          <Link 
            href="/admin/contacts" 
            onClick={closeMobileMenu}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              pathname === "/admin/contacts" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads & Contacts</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-border/50 flex items-center justify-between">
          <Link 
            href="/admin" 
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </Link>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
