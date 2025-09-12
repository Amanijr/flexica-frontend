"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/app/auth/SessionContext";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const { logout } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 
      h-10 md:h-11 px-4 md:px-5 
      text-sm md:text-base 
      bg-red-500 text-white 
      rounded-md shadow-md
      hover:bg-red-600 
      active:scale-95 
      transition 
      w-full md:w-auto justify-center shrink-0 ${className}`}
>
<LogOut size={18} />
<span className="hidden sm:inline">Logout</span>
    </button>
  );
}
