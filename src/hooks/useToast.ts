// Custom toast hook for consistent notifications

import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/types/constants';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 6000,
      description: options?.description,
      action: options?.action,
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: options?.action,
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
    });
  };

  // Predefined success messages
  const showActorCreated = () => showSuccess(SUCCESS_MESSAGES.ACTOR_CREATED);
  const showActorUpdated = () => showSuccess(SUCCESS_MESSAGES.ACTOR_UPDATED);
  const showActorDeleted = () => showSuccess(SUCCESS_MESSAGES.ACTOR_DELETED);
  const showProjectCreated = () => showSuccess(SUCCESS_MESSAGES.PROJECT_CREATED);
  const showProjectUpdated = () => showSuccess(SUCCESS_MESSAGES.PROJECT_UPDATED);
  const showProjectDeleted = () => showSuccess(SUCCESS_MESSAGES.PROJECT_DELETED);
  const showRoleCreated = () => showSuccess(SUCCESS_MESSAGES.ROLE_CREATED);
  const showRoleUpdated = () => showSuccess(SUCCESS_MESSAGES.ROLE_UPDATED);
  const showRoleDeleted = () => showSuccess(SUCCESS_MESSAGES.ROLE_DELETED);
  const showAssignmentCreated = () => showSuccess(SUCCESS_MESSAGES.ASSIGNMENT_CREATED);
  const showAssignmentUpdated = () => showSuccess(SUCCESS_MESSAGES.ASSIGNMENT_UPDATED);
  const showAssignmentRemoved = () => showSuccess(SUCCESS_MESSAGES.ASSIGNMENT_REMOVED);

  // Predefined error messages
  const showStorageError = () => showError(ERROR_MESSAGES.STORAGE_UNAVAILABLE);
  const showStorageQuotaError = () => showError(ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED);
  const showValidationError = () => showError(ERROR_MESSAGES.VALIDATION_ERROR);
  const showNetworkError = () => showError(ERROR_MESSAGES.NETWORK_ERROR);
  const showDataImportError = () => showError('Failed to import data. Please check the format.');
  const showDataExportError = () => showError('Failed to export data.');

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // Success shortcuts
    showActorCreated,
    showActorUpdated,
    showActorDeleted,
    showProjectCreated,
    showProjectUpdated,
    showProjectDeleted,
    showRoleCreated,
    showRoleUpdated,
    showRoleDeleted,
    showAssignmentCreated,
    showAssignmentUpdated,
    showAssignmentRemoved,
    // Error shortcuts
    showStorageError,
    showStorageQuotaError,
    showValidationError,
    showNetworkError,
    showDataImportError,
    showDataExportError,
  };
}; 