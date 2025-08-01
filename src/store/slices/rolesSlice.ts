// Roles slice for Zustand store

import type { StateCreator } from 'zustand';
import type { 
    Role, 
    Folder,
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
    folders: Folder[]; // Reference to folders for hierarchy queries
    
    // Actions
    addRole: (input: CreateRoleInput) => Role;
    updateRole: (id: string, updates: UpdateRoleInput) => void;
    deleteRole: (id: string) => void;
    getRolesByFolder: (folderId: string) => Role[]; // Direct folder only (no descendants)
    
    // Compatibility methods
    getRolesByProject: (projectId: string) => Role[]; // Includes descendants
}

export const createRolesSlice: StateCreator<
    RolesSlice,
    [],
    [],
    RolesSlice
> = (set, get) => ({
    roles: [],
    folders: [], // This will be injected by the main store

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

    getRolesByFolder: (folderId: string) => {
        const { roles } = get();
        return roles.filter(role => role.folderId === folderId);
    },

    // Compatibility method - includes descendants like the original behavior
    getRolesByProject: (projectId: string) => {
        const { roles, folders } = get();
        const descendantIds = getDescendantProjectIds(projectId, folders);
        const allFolderIds = [projectId, ...descendantIds];
        return roles.filter(role => allFolderIds.includes(role.folderId));
    },
});