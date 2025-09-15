import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  Database,
  Activity,
  DollarSign,
  Shield,
  FileText,
  BarChart3,
  Palette
} from "lucide-react";

const adminMenuItems = [
  {
    title: "System Overview",
    url: "/admin",
    icon: LayoutDashboard,
    group: "Main"
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    group: "Main"
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
    group: "Main"
  },
  {
    title: "Revenue & Billing",
    url: "/admin/revenue",
    icon: DollarSign,
    group: "Financial"
  },
  {
    title: "Subscription Plans",
    url: "/admin/pricing",
    icon: CreditCard,
    group: "Financial"
  },
  {
    title: "API Endpoints",
    url: "/admin/endpoints",
    icon: Database,
    group: "System"
  },
  {
    title: "System Health",
    url: "/admin/health",
    icon: Activity,
    group: "System"
  },
  {
    title: "Security & Audit",
    url: "/admin/security",
    icon: Shield,
    group: "System"
  },
  {
    title: "Logs",
    url: "/admin/logs",
    icon: FileText,
    group: "System"
  },
  {
    title: "Blog Management",
    url: "/admin/blog",
    icon: FileText,
    group: "Content"
  },
  {
    title: "Theme Settings",
    url: "/admin/themes",
    icon: Palette,
    group: "Configuration"
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    group: "Configuration"
  }
];

const menuGroups = [
  { name: "Main", items: adminMenuItems.filter(item => item.group === "Main") },
  { name: "Financial", items: adminMenuItems.filter(item => item.group === "Financial") },
  { name: "Content", items: adminMenuItems.filter(item => item.group === "Content") },
  { name: "System", items: adminMenuItems.filter(item => item.group === "System") },
  { name: "Configuration", items: adminMenuItems.filter(item => item.group === "Configuration") }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-api-secondary/10 text-api-secondary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}