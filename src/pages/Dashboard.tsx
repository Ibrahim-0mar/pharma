import { Database, LogOut, PillBottle, User } from "lucide-react";
import * as React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Separator } from "../components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const navigator = useNavigate();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <span className="text-lg font-semibold">
              {user.userType === "doctor" ? "Doctor" : "Pharmacist"} dashboard
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={"/dashboard"} className="block px-4 py-2">
                  <Database />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild>
                <Link to={"/dashboard/profile"} className="block px-4 py-2">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
              {user.userType === "doctor" ? (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to={"/dashboard/pharmacists"}
                      className="block px-4 py-2"
                    >
                      <PillBottle />
                      <span>pharmacists</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to={"/dashboard/prescription"}
                      className="block px-4 py-2"
                    >
                      <PillBottle />
                      <span>Prescription</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuButton
                className="flex items-center gap-2 px-4 py-2"
                onClick={() => {
                  localStorage.clear();
                  navigator("/");
                }}
              >
                <LogOut />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center h-16 gap-2 px-4 shrink-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <span className="text-sm">
            {" "}
            Doctor's Prescription System's Dashboard{" "}
          </span>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
