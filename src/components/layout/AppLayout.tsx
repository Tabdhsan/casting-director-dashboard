// Main application layout with navbar, sidebar, and content area

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';

export function AppLayout() {
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className="hidden md:flex">
                    <Sidebar />
                </aside>
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
                <MobileSidebar 
                    open={mobileMenuOpen} 
                    onClose={() => setMobileMenuOpen(false)} 
                />
            )}

            {/* Main content area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Navbar */}
                <Navbar 
                    onMenuClick={isMobile ? handleMobileMenuToggle : undefined}
                />

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-4 md:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}