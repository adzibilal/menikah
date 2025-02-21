'use client';

import { ArrowLeftToLineIcon, ChevronUp, Home, User2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, 
         SidebarGroupContent, SidebarGroupLabel, SidebarMenu,
         SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, 
         DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type MenuItem = {
    title: string;
    url: string;
    icon: React.ComponentType;
};

const MENU_ITEMS = {
    admin: [
        { title: 'Dashboard', url: '/dashboard', icon: Home },
        { title: 'Users', url: '/dashboard/users', icon: User2 }
    ],
    user: [
        { title: 'Dashboard', url: '/dashboard/u/', icon: Home }
    ]
} as const;

export function AppSidebar() {
    const { data: session } = useSession();
    const pathName = usePathname();
    const [menuItem, setMenuItem] = useState<MenuItem[]>([]);

    useEffect(() => {
        const isAdminPath = ['/dashboard', '/dashboard/users'].includes(pathName);
        setMenuItem(isAdminPath ? [...MENU_ITEMS.admin] : [...MENU_ITEMS.user]);
    }, [pathName]);

    const showBackToAdmin = session?.user?.role === 'admin' && 
                          !['/dashboard', '/dashboard/users'].includes(pathName);

    return (
        <Sidebar>
            <SidebarTrigger className="absolute -right-4 top-[50%] translate-y-[-50%] z-30 border bg-zinc-50" />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menikah</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItem.map(({ title, url, icon: Icon }) => (
                                <SidebarMenuItem key={title}>
                                    <SidebarMenuButton asChild isActive={pathName === url}>
                                        <a href={url}>
                                            <Icon />
                                            <span>{title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {showBackToAdmin && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild> 
                                        <a href="/dashboard">
                                            <ArrowLeftToLineIcon />
                                            <span>Back to Admin Dashboard</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 />
                                    {session?.user?.name || 'User'}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>{session?.user?.name}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>{session?.user?.email}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/sign-in' })}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
