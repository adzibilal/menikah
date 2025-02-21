import { Metadata } from "next"

import {
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard layout with sidebar navigation",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4">
        {children}
      </main>
    </SidebarProvider>
  )
}
