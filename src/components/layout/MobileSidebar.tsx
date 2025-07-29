// Mobile sidebar using Sheet component

import { NavLink, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FolderOpen, 
    Users, 
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { ROUTES } from '@/types/constants';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
}

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Projects', href: ROUTES.PROJECTS, icon: FolderOpen },
    { name: 'Actor Database', href: ROUTES.ACTORS, icon: Users },
    { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
];

interface MobileSidebarProps {
    open: boolean;
    onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
    const location = useLocation();

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="border-b p-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <span className="text-sm font-bold text-primary-foreground">CD</span>
                            </div>
                            <span>Casting Dashboard</span>
                        </SheetTitle>
                    </div>
                </SheetHeader>

                {/* Navigation links */}
                <nav className="flex-1 space-y-1 p-4">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={onClose} // Close sidebar when navigating
                                className={({ isActive: linkIsActive }) =>
                                    cn(
                                        'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        'hover:bg-accent hover:text-accent-foreground',
                                        'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                                        linkIsActive || isActive
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground'
                                    )
                                }
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                <span className="ml-3 truncate">{item.name}</span>
                                {item.badge && (
                                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t p-4">
                    <div className="rounded-lg bg-muted p-3 text-center">
                        <p className="text-xs font-medium">Demo Mode</p>
                        <p className="text-xs text-muted-foreground">
                            Data stored locally
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}