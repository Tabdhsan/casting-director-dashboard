// Main Zustand store with localStorage persistence

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
    Actor,
    Project,
    Role,
    ActorAssignment,
    ActorFilters,
    UIState,
    DashboardMetrics,
    CreateActorInput,
    CreateProjectInput,
    CreateRoleInput,
    CreateAssignmentInput,
    UpdateActorInput,
    UpdateProjectInput,
    UpdateRoleInput,
    UpdateAssignmentInput,
} from '../types';
import {
    createActor,
    createProject,
    createRole,
    createAssignment,
    updateEntity,
    filterActors,
    buildProjectHierarchy,
    getDescendantProjectIds,
    getProjectBreadcrumb,
    calculateDashboardMetrics,
    getActorsByBucket,
    getActorRoleHistory,
    extractUniqueTags,
    extractUniqueValues,
} from '../utils/typeHelpers';
import { STORAGE_KEYS } from '../types/constants';
import { StorageManager } from '../utils/storage';

// Custom storage implementation with error handling
const customStorage = {
    getItem: (name: string) => {
        const result = StorageManager.getItem(name);
        if (result.error) {
            console.error('Storage read error:', result.error);
            // In a real app, you might want to show a toast here
            return null;
        }
        return result.value;
    },
    setItem: (name: string, value: string) => {
        const error = StorageManager.setItem(name, value);
        if (error) {
            console.error('Storage write error:', error);
            // In a real app, you might want to show a toast here
        }
    },
    removeItem: (name: string) => {
        const error = StorageManager.removeItem(name);
        if (error) {
            console.error('Storage remove error:', error);
        }
    },
};

// Main store interface
export interface AppStore {
    // Data state
    actors: Actor[];
    projects: Project[];
    roles: Role[];
    assignments: ActorAssignment[];
    
    // UI state
    ui: UIState;
    
    // Actor actions
    addActor: (input: CreateActorInput) => Actor;
    updateActor: (id: string, updates: UpdateActorInput) => void;
    deleteActor: (id: string) => void;
    searchActors: (filters: ActorFilters) => Actor[];
    
    // Project actions
    addProject: (input: CreateProjectInput) => Project;
    updateProject: (id: string, updates: UpdateProjectInput) => void;
    deleteProject: (id: string) => void;
    getProjectHierarchy: () => Project[];
    getProjectBreadcrumb: (projectId: string) => Project[];
    
    // Role actions
    addRole: (input: CreateRoleInput) => Role;
    updateRole: (id: string, updates: UpdateRoleInput) => void;
    deleteRole: (id: string) => void;
    getRolesByProject: (projectId: string) => Role[];
    
    // Assignment actions
    assignActorToRole: (input: CreateAssignmentInput) => ActorAssignment;
    updateAssignment: (id: string, updates: UpdateAssignmentInput) => void;
    removeAssignment: (id: string) => void;
    getAssignmentsByRole: (roleId: string) => ActorAssignment[];
    getActorsByBucket: (roleId: string) => Record<string, Actor[]>;
    getActorRoleHistory: (actorId: string) => Array<{
        assignment: ActorAssignment;
        role: Role;
        project: Project;
    }>;
    
    // UI actions
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setSidebarUserPreference: (collapsed: boolean) => void;
    setCurrentView: (view: 'grid' | 'table') => void;
    setSelectedActors: (actorIds: string[]) => void;
    setActiveFilters: (filters: ActorFilters) => void;
    
    // Utility actions
    getDashboardMetrics: () => DashboardMetrics;
    getFilterOptions: () => {
        genders: string[];
        races: string[];
        heights: string[];
        representations: string[];
        tags: string[];
    };
    
    // Data management
    clearAllData: () => void;
    exportData: () => string;
    importData: (jsonData: string) => void;
}

// Create the store with persistence
export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            // Initial state
            actors: [],
            projects: [],
            roles: [],
            assignments: [],
            ui: {
                sidebarCollapsed: false,
                sidebarUserPreference: null,
                currentView: 'grid',
                selectedActors: [],
                activeFilters: {},
            },

            // Actor actions
            addActor: (input: CreateActorInput) => {
                const newActor = createActor(input);
                set(state => ({
                    actors: [...state.actors, newActor]
                }));
                return newActor;
            },

            updateActor: (id: string, updates: UpdateActorInput) => {
                set(state => ({
                    actors: state.actors.map(actor =>
                        actor.id === id ? updateEntity(actor, updates) : actor
                    )
                }));
            },

            deleteActor: (id: string) => {
                set(state => ({
                    actors: state.actors.filter(actor => actor.id !== id),
                    assignments: state.assignments.filter(assignment => assignment.actorId !== id),
                    ui: {
                        ...state.ui,
                        selectedActors: state.ui.selectedActors.filter(actorId => actorId !== id)
                    }
                }));
            },

            searchActors: (filters: ActorFilters) => {
                const { actors } = get();
                return filterActors(actors, filters);
            },

            // Project actions
            addProject: (input: CreateProjectInput) => {
                const newProject = createProject(input);
                set(state => ({
                    projects: [...state.projects, newProject]
                }));
                return newProject;
            },

            updateProject: (id: string, updates: UpdateProjectInput) => {
                set(state => ({
                    projects: state.projects.map(project =>
                        project.id === id ? updateEntity(project, updates) : project
                    )
                }));
            },

            deleteProject: (id: string) => {
                const { projects, roles } = get();
                const descendantIds = getDescendantProjectIds(id, projects);
                const allProjectIds = [id, ...descendantIds];
                const rolesToDelete = roles.filter(role => allProjectIds.includes(role.projectId));
                const roleIdsToDelete = rolesToDelete.map(role => role.id);

                set(state => ({
                    projects: state.projects.filter(project => !allProjectIds.includes(project.id)),
                    roles: state.roles.filter(role => !allProjectIds.includes(role.projectId)),
                    assignments: state.assignments.filter(assignment => 
                        !roleIdsToDelete.includes(assignment.roleId)
                    )
                }));
            },

            getProjectHierarchy: () => {
                const { projects } = get();
                return buildProjectHierarchy(projects);
            },

            getProjectBreadcrumb: (projectId: string) => {
                const { projects } = get();
                return getProjectBreadcrumb(projectId, projects);
            },

            // Role actions
            addRole: (input: CreateRoleInput) => {
                const newRole = createRole(input);
                set(state => ({
                    roles: [...state.roles, newRole]
                }));
                return newRole;
            },

            updateRole: (id: string, updates: UpdateRoleInput) => {
                set(state => ({
                    roles: state.roles.map(role =>
                        role.id === id ? updateEntity(role, updates) : role
                    )
                }));
            },

            deleteRole: (id: string) => {
                set(state => ({
                    roles: state.roles.filter(role => role.id !== id),
                    assignments: state.assignments.filter(assignment => assignment.roleId !== id)
                }));
            },

            getRolesByProject: (projectId: string) => {
                const { roles, projects } = get();
                const descendantIds = getDescendantProjectIds(projectId, projects);
                const allProjectIds = [projectId, ...descendantIds];
                return roles.filter(role => allProjectIds.includes(role.projectId));
            },

            // Assignment actions
            assignActorToRole: (input: CreateAssignmentInput) => {
                const newAssignment = createAssignment(input);
                set(state => ({
                    assignments: [...state.assignments, newAssignment]
                }));
                return newAssignment;
            },

            updateAssignment: (id: string, updates: UpdateAssignmentInput) => {
                set(state => ({
                    assignments: state.assignments.map(assignment =>
                        assignment.id === id ? updateEntity(assignment, updates) : assignment
                    )
                }));
            },

            removeAssignment: (id: string) => {
                set(state => ({
                    assignments: state.assignments.filter(assignment => assignment.id !== id)
                }));
            },

            getAssignmentsByRole: (roleId: string) => {
                const { assignments } = get();
                return assignments.filter(assignment => assignment.roleId === roleId);
            },

            getActorsByBucket: (roleId: string) => {
                const { assignments, actors, roles } = get();
                const role = roles.find(r => r.id === roleId);
                if (!role) return {};
                
                return getActorsByBucket(roleId, assignments, actors, role.customBuckets);
            },

            getActorRoleHistory: (actorId: string) => {
                const { assignments, roles, projects } = get();
                return getActorRoleHistory(actorId, assignments, roles, projects);
            },

            // UI actions
            toggleSidebar: () => {
                set(state => ({
                    ui: {
                        ...state.ui,
                        sidebarCollapsed: !state.ui.sidebarCollapsed,
                        sidebarUserPreference: !state.ui.sidebarCollapsed
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

            // Utility actions
            getDashboardMetrics: () => {
                const { actors, projects, roles, assignments } = get();
                return calculateDashboardMetrics(actors, projects, roles, assignments);
            },

            getFilterOptions: () => {
                const { actors } = get();
                return {
                    genders: extractUniqueValues(actors, 'gender'),
                    races: extractUniqueValues(actors, 'race'),
                    heights: extractUniqueValues(actors, 'height'),
                    representations: extractUniqueValues(actors, 'representation'),
                    tags: extractUniqueTags(actors),
                };
            },

            // Data management
            clearAllData: () => {
                set({
                    actors: [],
                    projects: [],
                    roles: [],
                    assignments: [],
                    ui: {
                        sidebarCollapsed: false,
                        sidebarUserPreference: null,
                        currentView: 'grid',
                        selectedActors: [],
                        activeFilters: {},
                    }
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
        }),
        {
            name: STORAGE_KEYS.APP_VERSION, // Use a single key for the entire store
            storage: createJSONStorage(() => customStorage),
            partialize: (state) => ({
                actors: state.actors,
                projects: state.projects,
                roles: state.roles,
                assignments: state.assignments,
                ui: state.ui,
            }),
        }
    )
);