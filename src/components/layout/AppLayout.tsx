// Main application layout with navbar, sidebar, and content area

import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Toaster } from '@/components/ui/sonner';

export function AppLayout() {
    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                {/* Navbar */}
                <Navbar />
                
                {/* Main content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-20 md:pb-6">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation - hidden on desktop */}
                <div className="md:hidden">
                    <BottomNav />
                </div>
            </div>
            
            {/* Toast notifications */}
            <Toaster />
        </div>
    );
}