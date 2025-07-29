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
}

export const createUISlice: StateCreator<
    UISlice,
    [],
    [],
    UISlice
> = (set) => ({
    ui: {
        sidebarCollapsed: false,
        currentView: 'grid',
        selectedActors: [],
        activeFilters: {},
    },

    toggleSidebar: () => {
        set(state => ({
            ui: {
                ...state.ui,
                sidebarCollapsed: !state.ui.sidebarCollapsed
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
});