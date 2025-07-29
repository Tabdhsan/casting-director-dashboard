// Projects slice for Zustand store

import type { StateCreator } from 'zustand';
import type { 
    Project, 
    CreateProjectInput, 
    UpdateProjectInput 
} from '../../types';
import { 
    createProject, 
    updateEntity, 
    buildProjectHierarchy, 
    getDescendantProjectIds, 
    getProjectBreadcrumb 
} from '../../utils/typeHelpers';

export interface ProjectsSlice {
    projects: Project[];
    
    // Actions
    addProject: (input: CreateProjectInput) => Project;
    updateProject: (id: string, updates: UpdateProjectInput) => void;
    deleteProject: (id: string) => void;
    getProjectHierarchy: () => Project[];
    getProjectBreadcrumb: (projectId: string) => Project[];
    getDescendantProjectIds: (projectId: string) => string[];
}

export const createProjectsSlice: StateCreator<
    ProjectsSlice,
    [],
    [],
    ProjectsSlice
> = (set, get) => ({
    projects: [],

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
        const { projects } = get();
        const descendantIds = getDescendantProjectIds(id, projects);
        const allProjectIds = [id, ...descendantIds];

        set(state => ({
            projects: state.projects.filter(project => !allProjectIds.includes(project.id))
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

    getDescendantProjectIds: (projectId: string) => {
        const { projects } = get();
        return getDescendantProjectIds(projectId, projects);
    },
});