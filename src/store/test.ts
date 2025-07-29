// Simple test to verify store functionality
// This file can be removed after testing

import { useAppStore } from './index';
import type { CreateActorInput, CreateProjectInput } from '../types';

// Test function to verify store operations
export function testStore() {
    const store = useAppStore.getState();
    
    console.log('Testing Zustand store...');
    
    // Test adding an actor
    const actorInput: CreateActorInput = {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        race: 'Caucasian',
        height: '6\'0"',
        representation: 'CAA',
        tags: ['Leading Man', 'Drama'],
        notes: 'Great stage presence',
    };
    
    const newActor = store.addActor(actorInput);
    console.log('Added actor:', newActor);
    
    // Test adding a project
    const projectInput: CreateProjectInput = {
        name: 'Test Project',
        type: 'project',
        description: 'A test project',
    };
    
    const newProject = store.addProject(projectInput);
    console.log('Added project:', newProject);
    
    // Test dashboard metrics
    const metrics = store.getDashboardMetrics();
    console.log('Dashboard metrics:', metrics);
    
    // Test UI state
    store.toggleSidebar();
    console.log('Sidebar collapsed:', store.ui.sidebarCollapsed);
    
    // Test data export
    const exportedData = store.exportData();
    console.log('Exported data length:', exportedData.length);
    
    console.log('Store test completed successfully!');
    
    return {
        actor: newActor,
        project: newProject,
        metrics,
        exportedData,
    };
}