// Mock project data for testing the project hierarchy

import type { CreateProjectInput } from '@/types';

export const mockProjects: CreateProjectInput[] = [
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

// Function to populate the store with mock project data
export const loadMockProjects = (addProject: (input: CreateProjectInput) => any) => {
    const addedProjects: any[] = [];
    
    // Define the hierarchical structure more explicitly
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
        const addedProject = addProject(projectWithParent);
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
    
    return addedProjects;
}; 