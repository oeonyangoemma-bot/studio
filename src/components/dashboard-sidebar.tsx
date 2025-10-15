"use client";

import { usePathname } from 'next/navigation';
import { Bot, LayoutDashboard, PlusCircle, Sprout } from 'lucide-react';

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Logo } from './logo';


const navItems = [
  { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/dashboard/analysis', icon: <PlusCircle />, label: 'New Analysis' },
  { href: '/dashboard/chatbot', icon: <Bot />, label: 'Agri-Chat' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={item.label}
                as="a"
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
