// Collapsible sidebar component with navigation links

import { NavLink, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FolderOpen, 
    Users, 
    Settings, 
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUI } from '@/hooks/useStore';
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

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation();
    const { ui, setSidebarCollapsed } = useUI();

    const isCollapsed = ui.sidebarCollapsed;

    return (
        <div
            className={cn(
                'flex h-full flex-col border-r bg-background transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64',
                className
            )}
        >
            {/* Sidebar header */}
            <div className="flex h-14 items-center justify-between px-3">
                {!isCollapsed && (
                    <span className="text-sm font-medium text-muted-foreground">
                        Navigation
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSidebarCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                        {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    </span>
                </Button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1 px-2 py-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
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
                            {!isCollapsed && (
                                <>
                                    <span className="ml-3 truncate">{item.name}</span>
                                    {item.badge && (
                                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Sidebar footer */}
            <div className="border-t p-2">
                <div className={cn(
                    'rounded-lg bg-muted p-3 text-center',
                    isCollapsed && 'px-2'
                )}>
                    {!isCollapsed ? (
                        <>
                            <p className="text-xs font-medium">Demo Mode</p>
                            <p className="text-xs text-muted-foreground">
                                Data stored locally
                            </p>
                        </>
                    ) : (
                        <div className="h-2 w-2 rounded-full bg-green-500 mx-auto" title="Demo Mode" />
                    )}
                </div>
            </div>
        </div>
    );
}