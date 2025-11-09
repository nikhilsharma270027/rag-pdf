"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
        {/* <SidebarTrigger /> */}
      <main className="w-full">
        <div className="">{children}</div>
      </main>
    </SidebarProvider>
  );
}
