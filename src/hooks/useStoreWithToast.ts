// Wrapper hook that combines store actions with toast notifications

import { useAppStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { useErrorHandler } from '@/components/ui/error-boundary';

export const useStoreWithToast = () => {
    const store = useAppStore();
    const toast = useToast();
    const { handleError } = useErrorHandler();

    // Actor actions with toast
    const addActor = (input: any) => {
        try {
            const result = store.addActor(input);
            toast.showActorCreated();
            return result;
        } catch (error) {
            handleError(error as Error, 'addActor');
            toast.showError('Failed to create actor');
            throw error;
        }
    };

    const updateActor = (id: string, updates: any) => {
        try {
            store.updateActor(id, updates);
            toast.showActorUpdated();
        } catch (error) {
            handleError(error as Error, 'updateActor');
            toast.showError('Failed to update actor');
            throw error;
        }
    };

    const deleteActor = (id: string) => {
        try {
            store.deleteActor(id);
            toast.showActorDeleted();
        } catch (error) {
            handleError(error as Error, 'deleteActor');
            toast.showError('Failed to delete actor');
            throw error;
        }
    };

    // Project actions with toast
    const addProject = (input: any) => {
        try {
            const result = store.addProject(input);
            toast.showProjectCreated();
            return result;
        } catch (error) {
            handleError(error as Error, 'addProject');
            toast.showError('Failed to create project');
            throw error;
        }
    };

    const updateProject = (id: string, updates: any) => {
        try {
            store.updateProject(id, updates);
            toast.showProjectUpdated();
        } catch (error) {
            handleError(error as Error, 'updateProject');
            toast.showError('Failed to update project');
            throw error;
        }
    };

    const deleteProject = (id: string) => {
        try {
            store.deleteProject(id);
            toast.showProjectDeleted();
        } catch (error) {
            handleError(error as Error, 'deleteProject');
            toast.showError('Failed to delete project');
            throw error;
        }
    };

    // Role actions with toast
    const addRole = (input: any) => {
        try {
            const result = store.addRole(input);
            toast.showRoleCreated();
            return result;
        } catch (error) {
            handleError(error as Error, 'addRole');
            toast.showError('Failed to create role');
            throw error;
        }
    };

    const updateRole = (id: string, updates: any) => {
        try {
            store.updateRole(id, updates);
            toast.showRoleUpdated();
        } catch (error) {
            handleError(error as Error, 'updateRole');
            toast.showError('Failed to update role');
            throw error;
        }
    };

    const deleteRole = (id: string) => {
        try {
            store.deleteRole(id);
            toast.showRoleDeleted();
        } catch (error) {
            handleError(error as Error, 'deleteRole');
            toast.showError('Failed to delete role');
            throw error;
        }
    };

    // Assignment actions with toast
    const assignActorToRole = (input: any) => {
        try {
            const result = store.assignActorToRole(input);
            toast.showAssignmentCreated();
            return result;
        } catch (error) {
            handleError(error as Error, 'assignActorToRole');
            toast.showError('Failed to assign actor to role');
            throw error;
        }
    };

    const updateAssignment = (id: string, updates: any) => {
        try {
            store.updateAssignment(id, updates);
            toast.showAssignmentUpdated();
        } catch (error) {
            handleError(error as Error, 'updateAssignment');
            toast.showError('Failed to update assignment');
            throw error;
        }
    };

    const removeAssignment = (id: string) => {
        try {
            store.removeAssignment(id);
            toast.showAssignmentRemoved();
        } catch (error) {
            handleError(error as Error, 'removeAssignment');
            toast.showError('Failed to remove assignment');
            throw error;
        }
    };

    // Data management with toast
    const clearAllData = () => {
        try {
            store.clearAllData();
            toast.showInfo('All data cleared successfully');
        } catch (error) {
            handleError(error as Error, 'clearAllData');
            toast.showError('Failed to clear data');
            throw error;
        }
    };

    const exportData = () => {
        try {
            const result = store.exportData();
            toast.showInfo('Data exported successfully');
            return result;
        } catch (error) {
            handleError(error as Error, 'exportData');
            toast.showDataExportError();
            throw error;
        }
    };

    const importData = (jsonData: string) => {
        try {
            store.importData(jsonData);
            toast.showInfo('Data imported successfully');
        } catch (error) {
            handleError(error as Error, 'importData');
            toast.showDataImportError();
            throw error;
        }
    };

    return {
        // State
        actors: store.actors,
        projects: store.projects,
        roles: store.roles,
        assignments: store.assignments,
        ui: store.ui,
        
        // Actions with toast
        addActor,
        updateActor,
        deleteActor,
        addProject,
        updateProject,
        deleteProject,
        addRole,
        updateRole,
        deleteRole,
        assignActorToRole,
        updateAssignment,
        removeAssignment,
        clearAllData,
        exportData,
        importData,
        
        // Other actions (without toast for now)
        searchActors: store.searchActors,
        getProjectHierarchy: store.getProjectHierarchy,
        getProjectBreadcrumb: store.getProjectBreadcrumb,
        getRolesByProject: store.getRolesByProject,
        getAssignmentsByRole: store.getAssignmentsByRole,
        getActorsByBucket: store.getActorsByBucket,
        getActorRoleHistory: store.getActorRoleHistory,
        getDashboardMetrics: store.getDashboardMetrics,
        getFilterOptions: store.getFilterOptions,
        toggleSidebar: store.toggleSidebar,
        setSidebarCollapsed: store.setSidebarCollapsed,
        setCurrentView: store.setCurrentView,
        setSelectedActors: store.setSelectedActors,
        setActiveFilters: store.setActiveFilters,
    };
}; 