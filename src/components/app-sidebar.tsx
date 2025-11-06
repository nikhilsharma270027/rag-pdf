import { Calendar, Home, Inbox, Scroll, Search, Settings, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { Scada } from "next/font/google";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Sciba", url: "#", icon: Scroll },
  // { title: "Calendar", url: "#", icon: Calendar },
  // { title: "Search", url: "#", icon: Search },
  // { title: "Settings", url: "#", icon: Settings },
]

export function AppSidebar() {
  const { data: session } = useSession();
  console.log("Session in Sidebar:", session);
  return (
    <Sidebar collapsible="icon" className=""> 
      <SidebarContent>

        {/* Header with Trigger */}
        <div className="border-b flex items-center justify-between p-4">
          <span className="font-bold text-lg group-data-[state=collapsed]:hidden"> Hi {session?.user.name || "Guest User"}</span>
          <SidebarTrigger />
        </div>

        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[state=collapsed]:hidden">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile section at bottom */}
        <div className="mt-auto border-t p-4 ">
          <div className="flex items-center gap-3">
          <User className="h-6 w-6" />
          <span className="font-medium group-data-[state=collapsed]:hidden">
            {session?.user.name || "Guest User"}
          </span>
          </div>
          <div className="px-0 text-sm text-muted-foreground group-data-[state=collapsed]:hidden">
            {session?.user.email}
          </div>
          
        </div>

      </SidebarContent>
    </Sidebar>
  )
}
