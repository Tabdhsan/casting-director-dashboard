// Mock role data for testing the role assignment system

import type { CreateRoleInput } from '@/types';

export const mockRoles = (projectIds: string[]): CreateRoleInput[] => [
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

// Function to populate the store with mock role data
export const loadMockRoles = (addRole: (input: CreateRoleInput) => any, projectIds: string[]) => {
    const roles = mockRoles(projectIds);
    return roles.map(role => addRole(role));
};

// Helper function to find project by name pattern
export const findProjectByName = (projects: any[], namePattern: string) => {
    return projects.find(p => p.name.includes(namePattern));
};

// Enhanced function to load roles with better project matching
export const loadMockRolesWithProjects = (addRole: (input: CreateRoleInput) => any, projects: any[]) => {
    const addedRoles: any[] = [];
    
    // Define role assignments with better project matching
    const roleAssignments = [
        // Inception roles (2 roles)
        {
            name: 'Cobb',
            description: 'Extractor who steals secrets from dreams',
            requirements: 'Leading man, age 35-45, intense, conflicted',
            projectPattern: 'Inception',
        },
        {
            name: 'Ariadne',
            description: 'Architect who designs dream worlds',
            requirements: 'Leading woman, age 25-35, intelligent, creative',
            projectPattern: 'Inception',
        },
        
        // Stranger Things - Episode 1 roles (2 roles)
        {
            name: 'Eleven',
            description: 'Mysterious girl with psychokinetic powers',
            requirements: 'Young actress, age 12-15, intense, mysterious',
            projectPattern: 'Episode 1 - The Vanishing',
        },
        {
            name: 'Mike Wheeler',
            description: 'Leader of the friend group',
            requirements: 'Young actor, age 12-15, natural leader, protective',
            projectPattern: 'Episode 1 - The Vanishing',
        },
        
        // Stranger Things - Episode 2 roles (2 roles)
        {
            name: 'Dustin Henderson',
            description: 'Smart friend with scientific knowledge',
            requirements: 'Young actor, age 12-15, intelligent, quirky',
            projectPattern: 'Episode 2 - The Weirdo',
        },
        {
            name: 'Lucas Sinclair',
            description: 'Skeptical friend who questions Eleven',
            requirements: 'Young actor, age 12-15, cautious, protective',
            projectPattern: 'Episode 2 - The Weirdo',
        },
        
        // Stranger Things - Season 2 Episode 1 roles (2 roles)
        {
            name: 'Max Mayfield',
            description: 'New girl with skateboarding skills',
            requirements: 'Young actress, age 12-15, tomboy, confident',
            projectPattern: 'Episode 1 - MADMAX',
        },
        {
            name: 'Billy Hargrove',
            description: 'Max\'s aggressive stepbrother',
            requirements: 'Young actor, age 16-18, intimidating, troubled',
            projectPattern: 'Episode 1 - MADMAX',
        },
        
        // Stranger Things - Season 2 Episode 2 roles (2 roles)
        {
            name: 'Will Byers',
            description: 'Boy connected to the Upside Down',
            requirements: 'Young actor, age 12-15, vulnerable, haunted',
            projectPattern: 'Episode 2 - Trick or Treat',
        },
        {
            name: 'Joyce Byers',
            description: 'Will\'s determined mother',
            requirements: 'Actress, age 35-45, protective, determined',
            projectPattern: 'Episode 2 - Trick or Treat',
        },
        
        // Hamilton - New York Performance roles (2 roles)
        {
            name: 'Alexander Hamilton',
            description: 'Founding father and protagonist',
            requirements: 'Strong singer, age 25-35, high energy, rap skills',
            projectPattern: 'New York Performance',
        },
        {
            name: 'Aaron Burr',
            description: 'Hamilton\'s rival and narrator',
            requirements: 'Strong singer, age 30-40, conflicted, baritone',
            projectPattern: 'New York Performance',
        },
        
        // Hamilton - London Performance roles (2 roles)
        {
            name: 'Eliza Hamilton',
            description: 'Hamilton\'s wife and emotional center',
            requirements: 'Strong singer, age 25-35, emotional depth, soprano',
            projectPattern: 'London Performance',
        },
        {
            name: 'George Washington',
            description: 'Commander-in-chief and father figure',
            requirements: 'Strong singer, age 40-50, commanding presence, bass',
            projectPattern: 'London Performance',
        },
    ];
    
    // Create roles with proper project assignment
    roleAssignments.forEach(roleData => {
        const project = findProjectByName(projects, roleData.projectPattern);
        if (project) {
            const roleInput: CreateRoleInput = {
                name: roleData.name,
                description: roleData.description,
                requirements: roleData.requirements,
                projectId: project.id,
            };
            const addedRole = addRole(roleInput);
            addedRoles.push(addedRole);
        }
    });
    
    return addedRoles;
}; 