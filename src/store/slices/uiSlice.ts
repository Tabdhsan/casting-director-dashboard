// UI state slice for Zustand store

import type { StateCreator } from 'zustand';
import type { UIState, ActorFilters } from '../../types';

export interface UISlice {
    ui: UIState;
    
    // Actions
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setCurrentView: (view: 'grid' | 'table') => void;
    setSelectedActors: (actorIds: string[]) => void;
    setActiveFilters: (filters: ActorFilters) => void;
    clearSelectedActors: () => void;
    clearActiveFilters: () => void;
    setSidebarUserPreference: (collapsed: boolean) => void;
    toggleShowArchived: () => void;
    setShowArchived: (show: boolean) => void;
}

export const createUISlice: StateCreator<
    UISlice,
    [],
    [],
    UISlice
> = (set) => ({
    ui: {
        sidebarCollapsed: false,
        sidebarUserPreference: null, // Track user's manual preference
        currentView: 'grid',
        selectedActors: [],
        activeFilters: {},
        showArchived: false, // Default to hiding archived content
    },

    toggleSidebar: () => {
        set(state => ({
            ui: {
                ...state.ui,
                sidebarCollapsed: !state.ui.sidebarCollapsed,
                sidebarUserPreference: !state.ui.sidebarCollapsed // Store user preference
            }
        }));
    },

    setSidebarCollapsed: (collapsed: boolean) => {
        set(state => ({
            ui: {
                ...state.ui,
                sidebarCollapsed: collapsed
            }
        }));
    },

    setSidebarUserPreference: (collapsed: boolean) => {
        set(state => ({
            ui: {
                ...state.ui,
                sidebarCollapsed: collapsed,
                sidebarUserPreference: collapsed
            }
        }));
    },

    setCurrentView: (view: 'grid' | 'table') => {
        set(state => ({
            ui: {
                ...state.ui,
                currentView: view
            }
        }));
    },

    setSelectedActors: (actorIds: string[]) => {
        set(state => ({
            ui: {
                ...state.ui,
                selectedActors: actorIds
            }
        }));
    },

    setActiveFilters: (filters: ActorFilters) => {
        set(state => ({
            ui: {
                ...state.ui,
                activeFilters: filters
            }
        }));
    },

    clearSelectedActors: () => {
        set(state => ({
            ui: {
                ...state.ui,
                selectedActors: []
            }
        }));
    },

    clearActiveFilters: () => {
        set(state => ({
            ui: {
                ...state.ui,
                activeFilters: {}
            }
        }));
    },

    toggleShowArchived: () => {
        set(state => ({
            ui: {
                ...state.ui,
                showArchived: !state.ui.showArchived
            }
        }));
    },

    setShowArchived: (show: boolean) => {
        set(state => ({
            ui: {
                ...state.ui,
                showArchived: show
            }
        }));
    },
});