// Roles slice for Zustand store

import type { StateCreator } from 'zustand';
import type { 
    Role, 
    Project,
    CreateRoleInput, 
    UpdateRoleInput 
} from '../../types';
import { 
    createRole, 
    updateEntity, 
    getDescendantProjectIds 
} from '../../utils/typeHelpers';

export interface RolesSlice {
    roles: Role[];
    projects: Project[]; // Reference to projects for hierarchy queries
    
    // Actions
    addRole: (input: CreateRoleInput) => Role;
    updateRole: (id: string, updates: UpdateRoleInput) => void;
    deleteRole: (id: string) => void;
    getRolesByProject: (projectId: string) => Role[];
}

export const createRolesSlice: StateCreator<
    RolesSlice,
    [],
    [],
    RolesSlice
> = (set, get) => ({
    roles: [],
    projects: [], // This will be injected by the main store

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
            roles: state.roles.filter(role => role.id !== id)
        }));
    },

    getRolesByProject: (projectId: string) => {
        const { roles, projects } = get();
        const descendantIds = getDescendantProjectIds(projectId, projects);
        const allProjectIds = [projectId, ...descendantIds];
        return roles.filter(role => allProjectIds.includes(role.projectId));
    },
});