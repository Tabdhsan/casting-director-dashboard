// Assignments slice for Zustand store

import type { StateCreator } from 'zustand';
import type { 
    ActorAssignment, 
    CreateAssignmentInput, 
    UpdateAssignmentInput,
    Actor,
    Role,
    Folder
} from '../../types';
import { 
    createAssignment, 
    updateEntity, 
    getActorsByBucket, 
    getActorRoleHistory 
} from '../../utils/typeHelpers';

export interface AssignmentsSlice {
    assignments: ActorAssignment[];
    actors: Actor[]; // Reference to actors
    roles: Role[]; // Reference to roles
    folders: Folder[]; // Reference to folders (formerly projects)
    
    // Actions
    assignActorToRole: (input: CreateAssignmentInput) => ActorAssignment;
    updateAssignment: (id: string, updates: UpdateAssignmentInput) => void;
    removeAssignment: (id: string) => void;
    getAssignmentsByRole: (roleId: string) => ActorAssignment[];
    getActorsByBucket: (roleId: string) => Record<string, Actor[]>;
    getActorRoleHistory: (actorId: string) => Array<{
        assignment: ActorAssignment;
        role: Role;
        folder: Folder;
    }>;
    
    // Compatibility getter
    projects: Folder[];
}

export const createAssignmentsSlice: StateCreator<
    AssignmentsSlice,
    [],
    [],
    AssignmentsSlice
> = (set, get) => ({
    assignments: [],
    actors: [], // Will be injected by main store
    roles: [], // Will be injected by main store
    folders: [], // Will be injected by main store

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
        const { assignments, roles, folders } = get();
        return getActorRoleHistory(actorId, assignments, roles, folders);
    },

    // Compatibility getter
    get projects() {
        return this.folders;
    },
});