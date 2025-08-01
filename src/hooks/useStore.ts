// Custom hooks for using the Zustand store

import { useAppStore } from '../store';

// Hook for actor operations
export const useActors = () => {
    const actors = useAppStore(state => state.actors);
    const addActor = useAppStore(state => state.addActor);
    const updateActor = useAppStore(state => state.updateActor);
    const deleteActor = useAppStore(state => state.deleteActor);
    const searchActors = useAppStore(state => state.searchActors);
    const getFilterOptions = useAppStore(state => state.getFilterOptions);

    return {
        actors,
        addActor,
        updateActor,
        deleteActor,
        searchActors,
        getFilterOptions,
    };
};

// Hook for project operations
export const useProjects = () => {
    const projects = useAppStore(state => state.projects);
    const addProject = useAppStore(state => state.addProject);
    const updateProject = useAppStore(state => state.updateProject);
    const deleteProject = useAppStore(state => state.deleteProject);
    const getProjectHierarchy = useAppStore(state => state.getProjectHierarchy);
    const getProjectBreadcrumb = useAppStore(state => state.getProjectBreadcrumb);

    return {
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectHierarchy,
        getProjectBreadcrumb,
    };
};

// Hook for role operations
export const useRoles = () => {
    const roles = useAppStore(state => state.roles);
    const addRole = useAppStore(state => state.addRole);
    const updateRole = useAppStore(state => state.updateRole);
    const deleteRole = useAppStore(state => state.deleteRole);
    const getRolesByProject = useAppStore(state => state.getRolesByProject);
    const getRolesByFolder = useAppStore(state => state.getRolesByFolder);

    return {
        roles,
        addRole,
        updateRole,
        deleteRole,
        getRolesByProject,
        getRolesByFolder,
    };
};

// Hook for assignment operations
export const useAssignments = () => {
    const assignments = useAppStore(state => state.assignments);
    const assignActorToRole = useAppStore(state => state.assignActorToRole);
    const updateAssignment = useAppStore(state => state.updateAssignment);
    const removeAssignment = useAppStore(state => state.removeAssignment);
    const getAssignmentsByRole = useAppStore(state => state.getAssignmentsByRole);
    const getActorsByBucket = useAppStore(state => state.getActorsByBucket);
    const getActorRoleHistory = useAppStore(state => state.getActorRoleHistory);

    return {
        assignments,
        assignActorToRole,
        updateAssignment,
        removeAssignment,
        getAssignmentsByRole,
        getActorsByBucket,
        getActorRoleHistory,
    };
};

// Hook for UI state
export const useUI = () => {
    const ui = useAppStore(state => state.ui);
    const toggleSidebar = useAppStore(state => state.toggleSidebar);
    const setSidebarCollapsed = useAppStore(state => state.setSidebarCollapsed);
    const setSidebarUserPreference = useAppStore(state => state.setSidebarUserPreference);
    const setCurrentView = useAppStore(state => state.setCurrentView);
    const setSelectedActors = useAppStore(state => state.setSelectedActors);
    const setActiveFilters = useAppStore(state => state.setActiveFilters);

    return {
        ui,
        toggleSidebar,
        setSidebarCollapsed,
        setSidebarUserPreference,
        setCurrentView,
        setSelectedActors,
        setActiveFilters,
    };
};

// Hook for dashboard and utilities
export const useDashboard = () => {
    const getDashboardMetrics = useAppStore(state => state.getDashboardMetrics);
    const clearAllData = useAppStore(state => state.clearAllData);
    const exportData = useAppStore(state => state.exportData);
    const importData = useAppStore(state => state.importData);

    return {
        getDashboardMetrics,
        clearAllData,
        exportData,
        importData,
    };
};

// Combined hook for common operations
export const useCastingDashboard = () => {
    const actors = useActors();
    const projects = useProjects();
    const roles = useRoles();
    const assignments = useAssignments();
    const ui = useUI();
    const dashboard = useDashboard();

    return {
        actors,
        projects,
        roles,
        assignments,
        ui,
        dashboard,
    };
};