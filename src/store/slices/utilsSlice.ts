// Utils slice for computed values and data management

import type { StateCreator } from 'zustand';
import type { 
    DashboardMetrics,
    Actor,
    Project,
    Role,
    ActorAssignment
} from '../../types';
import { calculateDashboardMetrics } from '../../utils/typeHelpers';

export interface UtilsSlice {
    actors: Actor[]; // Reference to actors
    projects: Project[]; // Reference to projects
    roles: Role[]; // Reference to roles
    assignments: ActorAssignment[]; // Reference to assignments
    
    // Computed actions
    getDashboardMetrics: () => DashboardMetrics;
    
    // Data management
    clearAllData: () => void;
    exportData: () => string;
    importData: (jsonData: string) => void;
}

export const createUtilsSlice: StateCreator<
    UtilsSlice,
    [],
    [],
    UtilsSlice
> = (set, get) => ({
    actors: [], // Will be injected by main store
    projects: [], // Will be injected by main store
    roles: [], // Will be injected by main store
    assignments: [], // Will be injected by main store

    getDashboardMetrics: () => {
        const { actors, projects, roles, assignments } = get();
        return calculateDashboardMetrics(actors, projects, roles, assignments);
    },

    clearAllData: () => {
        set({
            actors: [],
            projects: [],
            roles: [],
            assignments: [],
        });
    },

    exportData: () => {
        const { actors, projects, roles, assignments } = get();
        return JSON.stringify({
            actors,
            projects,
            roles,
            assignments,
            exportedAt: new Date().toISOString(),
        }, null, 2);
    },

    importData: (jsonData: string) => {
        try {
            const data = JSON.parse(jsonData);
            
            // Basic validation
            if (!Array.isArray(data.actors) || !Array.isArray(data.projects) || 
                !Array.isArray(data.roles) || !Array.isArray(data.assignments)) {
                throw new Error('Invalid data format');
            }

            // Convert date strings back to Date objects
            const actors = data.actors.map((actor: any) => ({
                ...actor,
                createdAt: new Date(actor.createdAt),
                updatedAt: new Date(actor.updatedAt),
            }));

            const projects = data.projects.map((project: any) => ({
                ...project,
                createdAt: new Date(project.createdAt),
                updatedAt: new Date(project.updatedAt),
            }));

            const roles = data.roles.map((role: any) => ({
                ...role,
                createdAt: new Date(role.createdAt),
                updatedAt: new Date(role.updatedAt),
            }));

            const assignments = data.assignments.map((assignment: any) => ({
                ...assignment,
                assignedAt: new Date(assignment.assignedAt),
                updatedAt: new Date(assignment.updatedAt),
            }));

            set({
                actors,
                projects,
                roles,
                assignments,
            });
        } catch (error) {
            console.error('Failed to import data:', error);
            throw new Error('Failed to import data. Please check the format.');
        }
    },
});