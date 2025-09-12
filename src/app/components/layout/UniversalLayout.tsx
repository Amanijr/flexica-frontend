"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "../reusables/Footer";

interface UniversalLayoutProps {
  children: React.ReactNode;
}

export default function UniversalLayout({ children }: UniversalLayoutProps) {
  const pathname = usePathname();
  
  // Exclude navbar and footer for specific routes
  const excludedRoutes = ["/cartItem", "/login", "/registration"];
  const shouldExcludeLayout = excludedRoutes.includes(pathname);
  
  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}