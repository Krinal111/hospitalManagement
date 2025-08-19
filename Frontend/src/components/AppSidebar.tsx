import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthActions } from "../hooks/useAuth";
import { getMenu } from "../config/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import { Button } from "./ui/button";

export default function AppSidebarLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const location = useLocation();
  const items = getMenu(user?.role ?? null);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-2 py-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Amrutam</div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {items.map((m) => (
                <SidebarMenuItem key={m.href}>
                  <SidebarMenuButton asChild isActive={location.pathname === m.href}>
                    <Link to={m.href}>
                      <m.icon className="size-4" />
                      <span>{m.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </SidebarFooter>
      </Sidebar>
      <div className="md:ml-64 p-4">{children}</div>
    </SidebarProvider>
  );
}


