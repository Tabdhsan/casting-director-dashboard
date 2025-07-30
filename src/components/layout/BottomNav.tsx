// Mobile bottom navigation component (PWA-style)

import { NavLink, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FolderOpen, 
    Users, 
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/types/constants';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Projects', href: ROUTES.PROJECTS, icon: FolderOpen },
    { name: 'Actors', href: ROUTES.ACTORS, icon: Users },
    { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
];

export function BottomNav() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
            <div className="flex items-center justify-around h-16 px-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive: linkIsActive }) =>
                                cn(
                                    'flex flex-col items-center justify-center flex-1 h-full min-w-0',
                                    'transition-colors duration-200',
                                    'hover:bg-accent/50',
                                    linkIsActive || isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )
                            }
                        >
                            <Icon className="h-5 w-5 mb-1" />
                            <span className="text-xs font-medium truncate">
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
} 