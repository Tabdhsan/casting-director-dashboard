// Mock project data for testing the project hierarchy

import type { CreateFolderInput } from '@/types';

export const mockProjects: CreateFolderInput[] = [
    // Inception - Single film (now just a folder that can contain roles)
    {
        name: 'Inception',
        description: 'Sci-fi thriller about dream infiltration',
    },
    
    // Stranger Things - TV series with seasons and episodes
    {
        name: 'Stranger Things',
        description: 'Netflix TV Series - Sci-fi Horror',
    },
    {
        name: 'Season 1',
        description: 'First season episodes',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 1 - The Vanishing of Will Byers',
        description: 'Season 1, Episode 1 - Will disappears into the Upside Down',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 2 - The Weirdo on Maple Street',
        description: 'Season 1, Episode 2 - Eleven appears and helps the kids',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Season 2',
        description: 'Second season episodes',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 1 - MADMAX',
        description: 'Season 2, Episode 1 - Max arrives in Hawkins',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'Episode 2 - Trick or Treat, Freak',
        description: 'Season 2, Episode 2 - Halloween night chaos',
        parentId: '', // Will be set dynamically
    },
    
    // Hamilton - Theater production with different performances
    {
        name: 'Hamilton',
        description: 'Broadway musical about Alexander Hamilton',
    },
    {
        name: 'New York Performance',
        description: 'Original Broadway production at Richard Rodgers Theatre',
        parentId: '', // Will be set dynamically
    },
    {
        name: 'London Performance',
        description: 'West End production at Victoria Palace Theatre',
        parentId: '', // Will be set dynamically
    },
];

// Function to populate the store with mock project data
export const loadMockProjects = (addProject: (input: CreateFolderInput) => any) => {
    const addedProjects: any[] = [];
    
    // Define the hierarchical structure more explicitly
    const projectHierarchy = [
        // Inception - Single film (now just a folder that can contain roles)
        {
            name: 'Inception',
            description: 'Sci-fi thriller about dream infiltration',
        },
        
        // Stranger Things - TV series with seasons and episodes
        {
            name: 'Stranger Things',
            description: 'Netflix TV Series - Sci-fi Horror',
            children: [
                {
                    name: 'Season 1',
                    description: 'First season episodes',
                    children: [
                        {
                            name: 'Episode 1 - The Vanishing of Will Byers',
                            description: 'Season 1, Episode 1 - Will disappears into the Upside Down',
                        },
                        {
                            name: 'Episode 2 - The Weirdo on Maple Street',
                            description: 'Season 1, Episode 2 - Eleven appears and helps the kids',
                        },
                    ],
                },
                {
                    name: 'Season 2',
                    description: 'Second season episodes',
                    children: [
                        {
                            name: 'Episode 1 - MADMAX',
                            description: 'Season 2, Episode 1 - Max arrives in Hawkins',
                        },
                        {
                            name: 'Episode 2 - Trick or Treat, Freak',
                            description: 'Season 2, Episode 2 - Halloween night chaos',
                        },
                    ],
                },
            ],
        },
        
        // Hamilton - Theater production with different performances
        {
            name: 'Hamilton',
            description: 'Broadway musical about Alexander Hamilton',
            children: [
                {
                    name: 'New York Performance',
                    description: 'Original Broadway production at Richard Rodgers Theatre',
                },
                {
                    name: 'London Performance',
                    description: 'West End production at Victoria Palace Theatre',
                },
            ],
        },
    ];
    
    // Recursive function to add projects with proper hierarchy
    const addProjectWithChildren = (projectData: any, parentId?: string) => {
        console.log('Adding project with children:', projectData);
        const { children, ...projectInput } = projectData;
        const projectWithParent = parentId ? { ...projectInput, parentId } : projectInput;
        console.log('Project with parent:', projectWithParent);
        const addedProject = addProject(projectWithParent);
        console.log('Project with parent 22222:', projectWithParent);

        console.log('Added project:', addedProject);
        addedProjects.push(addedProject);
        
        // Add children recursively
        if (children) {
            console.log('Adding children:', children);
            children.forEach((child: any) => {
                console.log('Adding child:', child);
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