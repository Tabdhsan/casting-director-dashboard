// Folders slice for Zustand store (formerly projects)

import type { StateCreator } from 'zustand';
import type { 
    Folder, 
    CreateFolderInput, 
    UpdateFolderInput 
} from '../../types';
import { 
    createProject, 
    updateEntity, 
    buildProjectHierarchy, 
    getDescendantProjectIds, 
    getProjectBreadcrumb 
} from '../../utils/typeHelpers';

export interface FoldersSlice {
    folders: Folder[];
    
    // Actions
    addFolder: (input: CreateFolderInput) => Folder;
    updateFolder: (id: string, updates: UpdateFolderInput) => void;
    deleteFolder: (id: string) => void;
    getFolderHierarchy: () => Folder[];
    getFolderBreadcrumb: (folderId: string) => Folder[];
    getDescendantFolderIds: (folderId: string) => string[];
    
    // Compatibility methods for gradual migration
    projects: Folder[];
    addProject: (input: CreateFolderInput) => Folder;
    updateProject: (id: string, updates: UpdateFolderInput) => void;
    deleteProject: (id: string) => void;
    getProjectHierarchy: () => Folder[];
    getProjectBreadcrumb: (projectId: string) => Folder[];
    getDescendantProjectIds: (projectId: string) => string[];
}

export const createFoldersSlice: StateCreator<
    FoldersSlice,
    [],
    [],
    FoldersSlice
> = (set, get) => ({
    folders: [],

    addFolder: (input: CreateFolderInput) => {
        const newFolder = createProject(input); // Keep using createProject helper for now
        set(state => ({
            folders: [...state.folders, newFolder]
        }));
        return newFolder;
    },

    updateFolder: (id: string, updates: UpdateFolderInput) => {
        set(state => ({
            folders: state.folders.map(folder =>
                folder.id === id ? updateEntity(folder, updates) : folder
            )
        }));
    },

    deleteFolder: (id: string) => {
        const { folders } = get();
        const descendantIds = getDescendantProjectIds(id, folders);
        const allFolderIds = [id, ...descendantIds];

        set(state => ({
            folders: state.folders.filter(folder => !allFolderIds.includes(folder.id))
        }));
    },

    getFolderHierarchy: () => {
        const { folders } = get();
        return buildProjectHierarchy(folders);
    },

    getFolderBreadcrumb: (folderId: string) => {
        const { folders } = get();
        return getProjectBreadcrumb(folderId, folders);
    },

    getDescendantFolderIds: (folderId: string) => {
        const { folders } = get();
        return getDescendantProjectIds(folderId, folders);
    },

    // Compatibility getters and methods
    get projects() {
        return this.folders;
    },

    addProject: (input: CreateFolderInput) => {
        return get().addFolder(input);
    },

    updateProject: (id: string, updates: UpdateFolderInput) => {
        return get().updateFolder(id, updates);
    },

    deleteProject: (id: string) => {
        return get().deleteFolder(id);
    },

    getProjectHierarchy: () => {
        return get().getFolderHierarchy();
    },

    getProjectBreadcrumb: (projectId: string) => {
        return get().getFolderBreadcrumb(projectId);
    },

    getDescendantProjectIds: (projectId: string) => {
        return get().getDescendantFolderIds(projectId);
    },
});

// Export compatibility alias
export const createProjectsSlice = createFoldersSlice;