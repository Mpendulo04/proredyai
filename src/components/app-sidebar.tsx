import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Mail, CalendarDays, Search, Info, ShieldAlert } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Smart Email Generator", url: "/email", icon: Mail },
  { title: "AI Task Planner", url: "/planner", icon: CalendarDays },
  { title: "AI Research Assistant", url: "/research", icon: Search },
  { title: "About", url: "/about", icon: Info },
  { title: "Responsible AI", url: "/responsible-ai", icon: ShieldAlert },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white">
            <svg viewBox="0 0 32 32" className="h-5 w-5">
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#9333ea" />
                  <stop offset="1" stop-color="#3b82f6" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="black" />
              <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#logoGradient)" />
              <path d="M 8 25 L 8 7 L 16 7 C 21 7 23 10 23 12.5 C 23 15 21 17 16 17 L 13 17 L 13 25 Z" fill="white" />
              <path d="M 18 11 L 20 14 L 16 14 Z" fill="url(#logoGradient)" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">ProRedy AI</span>
            <span className="text-xs text-muted-foreground">Productivity Assistant</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="px-2 py-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          <div className="font-medium text-sidebar-foreground">
            ProRedy AI
          </div>
          <div>Version 1.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
