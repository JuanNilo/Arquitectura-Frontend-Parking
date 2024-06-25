'use client'
import DenyAcces from "@/components/ui/DenyAcces";
import NavBar from "@/components/ui/NavBar";
import { useUserStore } from "@/store/UserStorage";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    

    return (
      <div>
        <NavBar/>
        {children}
      </div>
    );
  }
  