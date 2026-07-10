import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Mail, CalendarDays, Search, Info, ShieldAlert, ShieldCheck } from "lucide-react";
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
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #9333ea, #3b82f6)" }}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">AI Workplace</span>
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
            AI Workplace Productivity Assistant
          </div>
          <div>Version 1.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
