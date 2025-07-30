// Sample data for testing the dashboard

import type { CreateActorInput, CreateProjectInput, CreateRoleInput } from '@/types';
import { loadMockActors } from '@/mockData/actors';
import { loadMockProjects } from '@/mockData/projects';
import { loadMockRolesWithProjects } from '@/mockData/roles';

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
    // Inception - Single film (no substructure)
    {
        name: 'Inception',
        type: 'project',
        description: 'Sci-fi thriller about dream infiltration',
    },
    
    // Stranger Things - TV series with seasons and episodes
    {
        name: 'Stranger Things',
        type: 'folder',
        description: 'Netflix TV Series - Sci-fi Horror',
    },
    {
        name: 'Season 1',
        type: 'folder',
        description: 'First season episodes',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 1 - The Vanishing of Will Byers',
        type: 'project',
        description: 'Season 1, Episode 1 - Will disappears into the Upside Down',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 2 - The Weirdo on Maple Street',
        type: 'project',
        description: 'Season 1, Episode 2 - Eleven appears and helps the kids',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Season 2',
        type: 'folder',
        description: 'Second season episodes',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 1 - MADMAX',
        type: 'project',
        description: 'Season 2, Episode 1 - Max arrives in Hawkins',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 2 - Trick or Treat, Freak',
        type: 'project',
        description: 'Season 2, Episode 2 - Halloween night chaos',
        parentId: '', // Will be set dynamically
    },
    
    // Hamilton - Theater production with different performances
    {
        name: 'Hamilton',
        type: 'folder',
        description: 'Broadway musical about Alexander Hamilton',
    },
    {
        name: 'New York Performance',
        type: 'project',
        description: 'Original Broadway production at Richard Rodgers Theatre',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'London Performance',
        type: 'project',
        description: 'West End production at Victoria Palace Theatre',
        parentId: '', // Will be set dynamically
    },
];

export const sampleRoles = (projectIds: string[]): CreateRoleInput[] => [
    // Inception roles (2 roles)
    {
        name: 'Cobb',
        description: 'Extractor who steals secrets from dreams',
        requirements: 'Leading man, age 35-45, intense, conflicted',
        projectId: projectIds.find(id => id.includes('Inception')) || projectIds[0],
    },
    {
        name: 'Ariadne',
        description: 'Architect who designs dream worlds',
        requirements: 'Leading woman, age 25-35, intelligent, creative',
        projectId: projectIds.find(id => id.includes('Inception')) || projectIds[0],
    },
    
    // Stranger Things - Episode 1 roles (2 roles)
    {
        name: 'Eleven',
        description: 'Mysterious girl with psychokinetic powers',
        requirements: 'Young actress, age 12-15, intense, mysterious',
        projectId: projectIds.find(id => id.includes('Episode 1 - The Vanishing')) || projectIds[0],
    },
    {
        name: 'Mike Wheeler',
        description: 'Leader of the friend group',
        requirements: 'Young actor, age 12-15, natural leader, protective',
        projectId: projectIds.find(id => id.includes('Episode 1 - The Vanishing')) || projectIds[0],
    },
    
    // Stranger Things - Episode 2 roles (2 roles)
    {
        name: 'Dustin Henderson',
        description: 'Smart friend with scientific knowledge',
        requirements: 'Young actor, age 12-15, intelligent, quirky',
        projectId: projectIds.find(id => id.includes('Episode 2 - The Weirdo')) || projectIds[0],
    },
    {
        name: 'Lucas Sinclair',
        description: 'Skeptical friend who questions Eleven',
        requirements: 'Young actor, age 12-15, cautious, protective',
        projectId: projectIds.find(id => id.includes('Episode 2 - The Weirdo')) || projectIds[0],
    },
    
    // Stranger Things - Season 2 Episode 1 roles (2 roles)
    {
        name: 'Max Mayfield',
        description: 'New girl with skateboarding skills',
        requirements: 'Young actress, age 12-15, tomboy, confident',
        projectId: projectIds.find(id => id.includes('Episode 1 - MADMAX')) || projectIds[0],
    },
    {
        name: 'Billy Hargrove',
        description: 'Max\'s aggressive stepbrother',
        requirements: 'Young actor, age 16-18, intimidating, troubled',
        projectId: projectIds.find(id => id.includes('Episode 1 - MADMAX')) || projectIds[0],
    },
    
    // Stranger Things - Season 2 Episode 2 roles (2 roles)
    {
        name: 'Will Byers',
        description: 'Boy connected to the Upside Down',
        requirements: 'Young actor, age 12-15, vulnerable, haunted',
        projectId: projectIds.find(id => id.includes('Episode 2 - Trick or Treat')) || projectIds[0],
    },
    {
        name: 'Joyce Byers',
        description: 'Will\'s determined mother',
        requirements: 'Actress, age 35-45, protective, determined',
        projectId: projectIds.find(id => id.includes('Episode 2 - Trick or Treat')) || projectIds[0],
    },
    
    // Hamilton - New York Performance roles (2 roles)
    {
        name: 'Alexander Hamilton',
        description: 'Founding father and protagonist',
        requirements: 'Strong singer, age 25-35, high energy, rap skills',
        projectId: projectIds.find(id => id.includes('New York Performance')) || projectIds[0],
    },
    {
        name: 'Aaron Burr',
        description: 'Hamilton\'s rival and narrator',
        requirements: 'Strong singer, age 30-40, conflicted, baritone',
        projectId: projectIds.find(id => id.includes('New York Performance')) || projectIds[0],
    },
    
    // Hamilton - London Performance roles (2 roles)
    {
        name: 'Eliza Hamilton',
        description: 'Hamilton\'s wife and emotional center',
        requirements: 'Strong singer, age 25-35, emotional depth, soprano',
        projectId: projectIds.find(id => id.includes('London Performance')) || projectIds[0],
    },
    {
        name: 'George Washington',
        description: 'Commander-in-chief and father figure',
        requirements: 'Strong singer, age 40-50, commanding presence, bass',
        projectId: projectIds.find(id => id.includes('London Performance')) || projectIds[0],
    },
];

// Function to seed the store with sample data
export function seedSampleData(store: any) {
    console.log('Seeding sample data...');
    
    // Add actors
    const addedActors = sampleActors.map(actor => store.addActor(actor));
    console.log(`Added ${addedActors.length} actors`);
    
    // Add projects with proper hierarchy
    const addedProjects = [];
    
    // Define the hierarchical structure
    const projectHierarchy = [
        // Inception - Single film (no substructure)
        {
            name: 'Inception',
            type: 'project',
            description: 'Sci-fi thriller about dream infiltration',
        },
        
        // Stranger Things - TV series with seasons and episodes
        {
            name: 'Stranger Things',
            type: 'folder',
            description: 'Netflix TV Series - Sci-fi Horror',
            children: [
                {
                    name: 'Season 1',
                    type: 'folder',
                    description: 'First season episodes',
                    children: [
                        {
                            name: 'Episode 1 - The Vanishing of Will Byers',
                            type: 'project',
                            description: 'Season 1, Episode 1 - Will disappears into the Upside Down',
                        },
                        {
                            name: 'Episode 2 - The Weirdo on Maple Street',
                            type: 'project',
                            description: 'Season 1, Episode 2 - Eleven appears and helps the kids',
                        },
                    ],
                },
                {
                    name: 'Season 2',
                    type: 'folder',
                    description: 'Second season episodes',
                    children: [
                        {
                            name: 'Episode 1 - MADMAX',
                            type: 'project',
                            description: 'Season 2, Episode 1 - Max arrives in Hawkins',
                        },
                        {
                            name: 'Episode 2 - Trick or Treat, Freak',
                            type: 'project',
                            description: 'Season 2, Episode 2 - Halloween night chaos',
                        },
                    ],
                },
            ],
        },
        
        // Hamilton - Theater production with different performances
        {
            name: 'Hamilton',
            type: 'folder',
            description: 'Broadway musical about Alexander Hamilton',
            children: [
                {
                    name: 'New York Performance',
                    type: 'project',
                    description: 'Original Broadway production at Richard Rodgers Theatre',
                },
                {
                    name: 'London Performance',
                    type: 'project',
                    description: 'West End production at Victoria Palace Theatre',
                },
            ],
        },
    ];
    
    // Recursive function to add projects with proper hierarchy
    const addProjectWithChildren = (projectData: any, parentId?: string) => {
        const { children, ...projectInput } = projectData;
        const projectWithParent = parentId ? { ...projectInput, parentId } : projectInput;
        const addedProject = store.addProject(projectWithParent);
        addedProjects.push(addedProject);
        
        // Add children recursively
        if (children) {
            children.forEach((child: any) => {
                addProjectWithChildren(child, addedProject.id);
            });
        }
    };
    
    // Add all projects with proper hierarchy
    projectHierarchy.forEach(projectData => {
        addProjectWithChildren(projectData);
    });
    
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

// Function to seed the store with comprehensive demo data
export function seedFullDemoData(store: any) {
    console.log('Seeding full demo data...');
    
    // Add all mock actors
    const addedActors: any[] = [];
    loadMockActors((input: any) => {
        const actor = store.addActor(input);
        addedActors.push(actor);
    });
    console.log(`Added ${addedActors.length} actors`);
    
    // Add all mock projects with hierarchy
    const addedProjects: any[] = [];
    loadMockProjects((input: any) => {
        const project = store.addProject(input);
        addedProjects.push(project);
    });
    console.log(`Added ${addedProjects.length} projects`);
    
    // Add all mock roles
    const addedRoles = loadMockRolesWithProjects((input: any) => {
        const role = store.addRole(input);
        return role;
    }, addedProjects);
    console.log(`Added ${addedRoles.length} roles`);
    
    // Add realistic assignments
    if (addedActors.length > 0 && addedRoles.length > 0) {
        // Create some realistic assignments
        const assignments = [
            // Inception assignments
            {
                actorName: 'Emma Thompson',
                roleName: 'Ariadne',
                bucket: 'Submitted',
                notes: 'Perfect for the intelligent architect role',
            },
            {
                actorName: 'Michael Chen',
                roleName: 'Cobb',
                bucket: 'Callback',
                notes: 'Great intensity for the conflicted extractor',
            },
            
            // Stranger Things assignments
            {
                actorName: 'Sarah Johnson',
                roleName: 'Eleven',
                bucket: 'Submitted',
                notes: 'Perfect for the mysterious girl with powers',
            },
            {
                actorName: 'David Rodriguez',
                roleName: 'Mike Wheeler',
                bucket: 'Callback',
                notes: 'Natural leader qualities, great for Mike',
            },
            {
                actorName: 'Lisa Park',
                roleName: 'Dustin Henderson',
                bucket: 'Submitted',
                notes: 'Quirky personality perfect for Dustin',
            },
            {
                actorName: 'Emma Thompson',
                roleName: 'Lucas Sinclair',
                bucket: 'Callback',
                notes: 'Cautious and protective, great for Lucas',
            },
            
            // Hamilton assignments
            {
                actorName: 'Michael Chen',
                roleName: 'Alexander Hamilton',
                bucket: 'Submitted',
                notes: 'Strong performer, perfect for Hamilton',
            },
            {
                actorName: 'Sarah Johnson',
                roleName: 'Aaron Burr',
                bucket: 'Callback',
                notes: 'Conflicted character, great for Burr',
            },
            {
                actorName: 'Lisa Park',
                roleName: 'Eliza Hamilton',
                bucket: 'Submitted',
                notes: 'Beautiful voice, perfect for Eliza',
            },
            {
                actorName: 'David Rodriguez',
                roleName: 'George Washington',
                bucket: 'Callback',
                notes: 'Commanding presence, great for Washington',
            },
        ];
        
        // Create assignments
        assignments.forEach(({ actorName, roleName, bucket, notes }) => {
            const actor = addedActors.find((a: any) => a.name === actorName);
            const role = addedRoles.find((r: any) => r.name === roleName);
            
            if (actor && role && role.customBuckets.length > 0) {
                const bucketObj = role.customBuckets.find((b: any) => 
                    b.name.toLowerCase().includes(bucket.toLowerCase())
                ) || role.customBuckets[0];
                
                store.assignActorToRole({
                    actorId: actor.id,
                    roleId: role.id,
                    bucketId: bucketObj.id,
                    notes,
                });
            }
        });
    }
    
    console.log('Full demo data seeded successfully!');
}

// Function to reset all data
export function resetAllData(store: any) {
    console.log('Resetting all data...');
    
    // Clear all data
    store.clearAllData();
    
    console.log('All data reset successfully!');
}