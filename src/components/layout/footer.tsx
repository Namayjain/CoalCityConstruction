import Link from "next/link";
import { Building } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">Coal City Construction Pvt. Ltd.</span>
          </div>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin Panel</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Coal City Construction Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
