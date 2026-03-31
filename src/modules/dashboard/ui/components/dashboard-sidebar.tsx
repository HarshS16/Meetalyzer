"use client";

import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/dashboard/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/dashboard/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/dashboard/upgrade",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="border-none">
      <div className="glass-strong m-2 rounded-2xl h-[calc(100vh-1rem)] flex flex-col border border-primary/15 shadow-lg shadow-primary/5">
        <SidebarHeader className="text-sidebar-foreground">
          <Link href="/dashboard" className="flex items-center gap-2 px-2 pt-4 hover:opacity-80 transition-opacity">
            <Image src="/logo.svg" height={36} width={36} alt="voxtrace.ai" />
            <p className="text-2xl font-semibold text-primary">VoxTrace.AI</p>
          </Link>
        </SidebarHeader>

        <div className="px-4 py-4">
          <Separator className="opacity-20 bg-primary/30" />
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {firstSection.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.href}
                          className={`
                            transition-all duration-200 
                            hover:bg-primary/20 hover:text-primary
                            ${isActive ? 'bg-primary/15 text-primary border-l-2 border-primary' : 'text-sidebar-foreground'}
                          `}
                        >
                          <item.icon className="size-5" />
                          <span className="text-sm font-medium tracking-tight">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mt-auto pb-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {secondSection.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.href}
                          className={`
                            transition-all duration-200 
                            hover:bg-primary/20 hover:text-primary
                            ${isActive ? 'bg-primary/15 text-primary border-l-2 border-primary' : 'text-sidebar-foreground'}
                          `}
                        >
                          <item.icon className="size-5" />
                          <span className="text-sm font-medium tracking-tight">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
              
              <div className="px-2 pt-3">
                <Separator className="opacity-20 bg-primary/30 mb-3" />
                <DashboardUserButton />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};