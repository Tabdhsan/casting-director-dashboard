// Sample data for testing the dashboard

import type { CreateActorInput, CreateProjectInput, CreateRoleInput } from '@/types';

export const sampleActors: CreateActorInput[] = [
    {
        name: 'Emma Thompson',
        age: 32,
        gender: 'Female',
        race: 'Caucasian',
        height: '5\'6"',
        representation: 'CAA',
        tags: ['Leading Woman', 'Drama', 'Comedy'],
        notes: 'Versatile actress with strong stage background',
    },
    {
        name: 'Michael Chen',
        age: 28,
        gender: 'Male',
        race: 'Asian',
        height: '5\'10"',
        representation: 'WME',
        tags: ['Leading Man', 'Action', 'Martial Arts'],
        notes: 'Excellent physical performer with martial arts training',
    },
    {
        name: 'Sarah Johnson',
        age: 24,
        gender: 'Female',
        race: 'Black/African American',
        height: '5\'4"',
        representation: 'UTA',
        tags: ['Young Adult', 'Musical Theatre', 'Dance'],
        notes: 'Strong singer and dancer, Broadway experience',
    },
    {
        name: 'David Rodriguez',
        age: 45,
        gender: 'Male',
        race: 'Hispanic/Latino',
        height: '6\'1"',
        representation: 'ICM',
        tags: ['Character Actor', 'Villain', 'Drama'],
        notes: 'Commanding presence, great for authority figures',
    },
    {
        name: 'Lisa Park',
        age: 29,
        gender: 'Female',
        race: 'Asian',
        height: '5\'3"',
        representation: 'Gersh',
        tags: ['Comedy', 'Character Actor', 'Improv'],
        notes: 'Natural comedic timing, improv background',
    },
];

export const sampleProjects: CreateProjectInput[] = [
    {
        name: 'The Equalizer',
        type: 'folder',
        description: 'TV Series project folder',
    },
    {
        name: 'Season 4',
        type: 'folder',
        description: 'Fourth season episodes',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 8: "Justice"',
        type: 'project',
        description: 'Season 4, Episode 8',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Hamilton Revival',
        type: 'project',
        description: 'Broadway revival casting',
    },
    {
        name: 'Independent Films',
        type: 'folder',
        description: 'Various indie film projects',
    },
];

export const sampleRoles = (projectIds: string[]): CreateRoleInput[] => [
    {
        name: 'Detective Martinez',
        description: 'Lead detective investigating the case',
        requirements: 'Strong dramatic presence, age 35-45',
        projectId: projectIds[2] || projectIds[0], // Episode 8 or first available
    },
    {
        name: 'Alexander Hamilton',
        description: 'Founding father and protagonist',
        requirements: 'Strong singer, age 25-35, high energy',
        projectId: projectIds[3] || projectIds[0], // Hamilton or first available
    },
    {
        name: 'Suspect #1',
        description: 'Primary suspect in the investigation',
        requirements: 'Mysterious, age 30-40',
        projectId: projectIds[2] || projectIds[0], // Episode 8 or first available
    },
];

// Function to seed the store with sample data
export function seedSampleData(store: any) {
    console.log('Seeding sample data...');
    
    // Add actors
    const addedActors = sampleActors.map(actor => store.addActor(actor));
    console.log(`Added ${addedActors.length} actors`);
    
    // Add projects (need to handle hierarchy)
    const addedProjects = [];
    
    // Add root projects first
    const rootProjects = sampleProjects.filter(p => !p.parentId);
    for (const project of rootProjects) {
        const addedProject = store.addProject(project);
        addedProjects.push(addedProject);
    }
    
    // Add child projects
    const childProjects = sampleProjects.filter(p => p.parentId !== undefined);
    for (const project of childProjects) {
        // Find parent by name (for demo purposes)
        const parent: any = addedProjects.find((p: any) => 
            (project.parentId === '' && p.name === 'The Equalizer') ||
            (project.parentId === '' && project.name.includes('Season') && p.name === 'The Equalizer')
        );
        
        if (parent) {
            const projectWithParent: any = { ...project, parentId: parent.id };
            const addedProject: any = store.addProject(projectWithParent);
            addedProjects.push(addedProject);
        }
    }
    
    console.log(`Added ${addedProjects.length} projects`);
    
    // Add roles
    const projectIds = addedProjects.map(p => p.id);
    const roles = sampleRoles(projectIds);
    const addedRoles = roles.map(role => store.addRole(role));
    console.log(`Added ${addedRoles.length} roles`);
    
    // Add some assignments
    if (addedActors.length > 0 && addedRoles.length > 0) {
        // Assign first actor to first role
        const firstRole = addedRoles[0];
        if (firstRole.customBuckets.length > 0) {
            store.assignActorToRole({
                actorId: addedActors[0].id,
                roleId: firstRole.id,
                bucketId: firstRole.customBuckets[0].id,
                notes: 'Great fit for the role',
            });
        }
        
        // Assign second actor to second role if available
        if (addedRoles.length > 1 && addedActors.length > 1) {
            const secondRole = addedRoles[1];
            if (secondRole.customBuckets.length > 0) {
                store.assignActorToRole({
                    actorId: addedActors[1].id,
                    roleId: secondRole.id,
                    bucketId: secondRole.customBuckets[1] || secondRole.customBuckets[0],
                    notes: 'Callback scheduled',
                });
            }
        }
    }
    
    console.log('Sample data seeded successfully!');
}