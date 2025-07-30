// Custom hook for responsive behavior and breakpoint detection

import { useEffect, useState } from 'react';
import { useUI } from './useStore';

// Tailwind CSS breakpoints
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });
  
  const { ui, setSidebarCollapsed } = useUI();
  
  // Track screen size changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Smart responsive sidebar behavior
  useEffect(() => {
    const width = screenSize.width;
    const { sidebarUserPreference, sidebarCollapsed } = ui;
    
    // Determine what the collapsed state should be
    let shouldBeCollapsed: boolean | null = null;
    
    // For large screens (1200px+), respect user preference or default to expanded
    if (width >= 1200) {
      if (sidebarUserPreference !== null) {
        shouldBeCollapsed = sidebarUserPreference;
      } else {
        shouldBeCollapsed = false; // Default to expanded on large screens
      }
    }
    // Auto-collapse for all screens from tablet up to large desktop (768px-1199px)
    // This ensures it stays collapsed once it auto-collapses, until mobile
    else if (width >= BREAKPOINTS.md && width < 1200) {
      shouldBeCollapsed = true;
    }
    // Mobile screens (below 768px) use bottom nav, so sidebar state doesn't matter
    
    // Only update if the state actually needs to change
    if (shouldBeCollapsed !== null && sidebarCollapsed !== shouldBeCollapsed) {
      // Use a timeout to break the immediate update cycle
      const timeoutId = setTimeout(() => {
        setSidebarCollapsed(shouldBeCollapsed);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [screenSize.width, ui.sidebarUserPreference]); // Include user preference but not current collapsed state
  
  // Helper functions for breakpoint detection
  const isMobile = screenSize.width < BREAKPOINTS.md;
  const isTabletOrSmallLaptop = screenSize.width >= BREAKPOINTS.md && screenSize.width < 1200;
  const isLargeDesktop = screenSize.width >= 1200;
  
  // Determine if sidebar should be auto-collapsed (for all non-mobile, non-large-desktop)
  const shouldAutoCollapse = isTabletOrSmallLaptop;
  
  return {
    screenSize,
    isMobile,
    isTabletOrSmallLaptop,
    isLargeDesktop,
    shouldAutoCollapse,
    breakpoints: BREAKPOINTS,
  };
};