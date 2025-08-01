// Utility functions for working with types and data transformations

import type {
    Actor,
    Project,
    Folder,
    Role,
    ActorAssignment,
    ActorFilters,
    StatusBucket,
    DashboardMetrics,
    SerializedData
} from '../types';
import { DEFAULT_STATUS_BUCKETS } from '../types/constants';

// Generate unique IDs
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Simple localStorage utilities
export function serializeForStorage<T extends { createdAt?: Date; updatedAt?: Date; assignedAt?: Date }>(data: T): SerializedData<T> {
    return {
        ...data,
        createdAt: data.createdAt?.toISOString(),
        updatedAt: data.updatedAt?.toISOString(),
        assignedAt: data.assignedAt?.toISOString(),
    } as SerializedData<T>;
}

export function deserializeFromStorage<T>(data: SerializedData<T>): T {
    const result = { ...data } as any;

    if (data.createdAt) result.createdAt = new Date(data.createdAt);
    if (data.updatedAt) result.updatedAt = new Date(data.updatedAt);
    if (data.assignedAt) result.assignedAt = new Date(data.assignedAt);

    return result as T;
}

// Create new entities with default values
export function createActor(input: Omit<Actor, 'id' | 'createdAt' | 'updatedAt'>): Actor {
    const now = new Date();
    return {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
    };
}

export function createProject(input: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'archived'> & { archived?: boolean }): Folder {
    const now = new Date();
    return {
        ...input,
        archived: input.archived ?? false,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
    };
}

// Create folder function (alias for createProject)
export function createFolder(input: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'archived'> & { archived?: boolean }): Folder {
    return createProject(input);
}

export function createRole(input: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'customBuckets' | 'archived'> & { customBuckets?: StatusBucket[]; archived?: boolean }): Role {
    const now = new Date();
    return {
        ...input,
        id: generateId(),
        customBuckets: input.customBuckets || DEFAULT_STATUS_BUCKETS.map(bucket => ({
            ...bucket,
            id: generateId(),
        })),
        archived: input.archived ?? false,
        createdAt: now,
        updatedAt: now,
    };
}

export function createAssignment(input: Omit<ActorAssignment, 'id' | 'assignedAt' | 'updatedAt'>): ActorAssignment {
    const now = new Date();
    return {
        ...input,
        id: generateId(),
        assignedAt: now,
        updatedAt: now,
    };
}

// Update entities with new timestamp
export function updateEntity<T extends { updatedAt: Date }>(entity: T, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'assignedAt'>>): T {
    return {
        ...entity,
        ...updates,
        updatedAt: new Date(),
    } as T;
}

// Filter actors based on criteria
export function filterActors(actors: Actor[], filters: ActorFilters): Actor[] {
    return actors.filter(actor => {
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableText = `${actor.name} ${actor.notes} ${actor.tags.join(' ')} ${actor.representation}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        // Gender filter
        if (filters.gender && filters.gender.length > 0) {
            if (!filters.gender.includes(actor.gender)) {
                return false;
            }
        }

        // Age range filter
        if (filters.ageRange) {
            if (filters.ageRange.min !== undefined && actor.age < filters.ageRange.min) {
                return false;
            }
            if (filters.ageRange.max !== undefined && actor.age > filters.ageRange.max) {
                return false;
            }
        }

        // Height filter
        if (filters.height && filters.height.length > 0) {
            if (!filters.height.includes(actor.height)) {
                return false;
            }
        }

        // Race filter
        if (filters.race && filters.race.length > 0) {
            if (!filters.race.includes(actor.race)) {
                return false;
            }
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag => actor.tags.includes(tag));
            if (!hasMatchingTag) {
                return false;
            }
        }

        // Representation filter
        if (filters.representation && filters.representation.length > 0) {
            if (!filters.representation.includes(actor.representation)) {
                return false;
            }
        }

        return true;
    });
}

// Sort actors by different criteria
export function sortActors(actors: Actor[], sortBy: string): Actor[] {
    const sorted = [...actors];

    switch (sortBy) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'age-asc':
            return sorted.sort((a, b) => a.age - b.age);
        case 'age-desc':
            return sorted.sort((a, b) => b.age - a.age);
        case 'created-asc':
            return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        case 'created-desc':
            return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        case 'updated-asc':
            return sorted.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
        case 'updated-desc':
            return sorted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        default:
            return sorted;
    }
}

// Build project hierarchy tree
export function buildProjectHierarchy(projects: Project[]): Project[] {
    const projectMap = new Map<string, Project & { children: Project[] }>();
    const rootProjects: (Project & { children: Project[] })[] = [];

    // Create map with children arrays
    projects.forEach(project => {
        projectMap.set(project.id, { ...project, children: [] });
    });

    // Build hierarchy
    projects.forEach(project => {
        const projectWithChildren = projectMap.get(project.id)!;

        if (project.parentId) {
            const parent = projectMap.get(project.parentId);
            if (parent) {
                parent.children.push(projectWithChildren);
            } else {
                // Parent not found, treat as root
                rootProjects.push(projectWithChildren);
            }
        } else {
            rootProjects.push(projectWithChildren);
        }
    });

    return rootProjects;
}

// Get all descendant project IDs
export function getDescendantProjectIds(projectId: string, projects: Project[]): string[] {
    const descendants: string[] = [];
    const children = projects.filter(p => p.parentId === projectId);

    children.forEach(child => {
        descendants.push(child.id);
        descendants.push(...getDescendantProjectIds(child.id, projects));
    });

    return descendants;
}

// Get project breadcrumb path
export function getProjectBreadcrumb(projectId: string, projects: Project[]): Project[] {
    const breadcrumb: Project[] = [];
    let currentProject = projects.find(p => p.id === projectId);

    while (currentProject) {
        breadcrumb.unshift(currentProject);
        currentProject = currentProject.parentId
            ? projects.find(p => p.id === currentProject!.parentId)
            : undefined;
    }

    return breadcrumb;
}

// Calculate dashboard metrics
export function calculateDashboardMetrics(
    actors: Actor[],
    projects: Project[],
    roles: Role[],
    assignments: ActorAssignment[]
): DashboardMetrics {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentlyAddedActors = actors
        .filter(actor => actor.createdAt >= oneWeekAgo)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

    const assignedRoleIds = new Set(assignments.map(a => a.roleId));
    const openRoles = roles.filter(role => !assignedRoleIds.has(role.id)).length;

    return {
        totalActors: actors.length,
        totalFolders: projects.length,
        totalRoles: roles.length,
        openRoles,
        recentlyAddedActors,
        activeAssignments: assignments.length,
    };
}

// Get actors assigned to a role grouped by bucket
export function getActorsByBucket(
    roleId: string,
    assignments: ActorAssignment[],
    actors: Actor[],
    buckets: StatusBucket[]
): Record<string, Actor[]> {
    const roleAssignments = assignments.filter(a => a.roleId === roleId);
    const actorMap = new Map(actors.map(actor => [actor.id, actor]));

    const result: Record<string, Actor[]> = {};

    buckets.forEach(bucket => {
        const bucketAssignments = roleAssignments.filter(a => a.bucketId === bucket.id);
        result[bucket.id] = bucketAssignments
            .map(assignment => actorMap.get(assignment.actorId))
            .filter((actor): actor is Actor => actor !== undefined);
    });

    return result;
}

// Get actor's role history
export function getActorRoleHistory(
    actorId: string,
    assignments: ActorAssignment[],
    roles: Role[],
    projects: Project[]
): Array<{
    assignment: ActorAssignment;
    role: Role;
    project: Project;
}> {
    const actorAssignments = assignments.filter(a => a.actorId === actorId);
    const roleMap = new Map(roles.map(role => [role.id, role]));
    const projectMap = new Map(projects.map(project => [project.id, project]));

    return actorAssignments
        .map(assignment => {
            const role = roleMap.get(assignment.roleId);
            const project = role ? projectMap.get(role.folderId) : undefined;

            if (role && project) {
                return { assignment, role, project };
            }
            return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => b.assignment.assignedAt.getTime() - a.assignment.assignedAt.getTime());
}

// Validate folder depth
export function validateFolderDepth(parentId: string | undefined, projects: Project[], maxDepth: number = 10): boolean {
    if (!parentId) return true;

    let depth = 0;
    let currentParentId: string | undefined = parentId;

    while (currentParentId && depth < maxDepth) {
        const parent = projects.find(p => p.id === currentParentId);
        if (!parent) break;

        currentParentId = parent.parentId;
        depth++;
    }

    return depth < maxDepth;
}

// Extract unique values for filter options
export function extractUniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
    const values = items.map(item => item[key]);
    return Array.from(new Set(values));
}

// Extract unique tags from actors
export function extractUniqueTags(actors: Actor[]): string[] {
    const allTags = actors.flatMap(actor => actor.tags);
    return Array.from(new Set(allTags)).sort();
}