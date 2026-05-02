import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MouseTracker } from "@/components/ui/mouse-tracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MouseTracker />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
