// Custom toast hook for consistent notifications

import { toast } from 'sonner';
import confetti from 'canvas-confetti';
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

// Subtle confetti effect for celebrations
const triggerConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#92400e'],
    disableForReducedMotion: true,
  });
};

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      style: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '1px solid #f59e0b',
        color: '#92400e',
        fontWeight: '500',
      },
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 6000,
      description: options?.description,
      action: options?.action,
      style: {
        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        border: '1px solid #ef4444',
        color: '#991b1b',
        fontWeight: '500',
      },
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: options?.action,
      style: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '1px solid #f59e0b',
        color: '#92400e',
        fontWeight: '500',
      },
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action,
      style: {
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        border: '1px solid #3b82f6',
        color: '#1e40af',
        fontWeight: '500',
      },
    });
  };

  // Predefined success messages with enhanced styling
  const showActorCreated = () => {
    triggerConfetti();
    toast.success(SUCCESS_MESSAGES.ACTOR_CREATED, {
      style: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '1px solid #f59e0b',
        color: '#92400e',
        fontWeight: '600',
        fontSize: '14px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
      },
    });
  };
  
  const showActorUpdated = () => showSuccess(SUCCESS_MESSAGES.ACTOR_UPDATED);
  const showActorDeleted = () => showSuccess(SUCCESS_MESSAGES.ACTOR_DELETED);
  
  const showProjectCreated = () => {
    toast.success(SUCCESS_MESSAGES.PROJECT_CREATED, {
      style: {
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        border: '1px solid #6366f1',
        color: '#3730a3',
        fontWeight: '600',
        fontSize: '14px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
      },
    });
  };
  
  const showProjectUpdated = () => showSuccess(SUCCESS_MESSAGES.PROJECT_UPDATED);
  const showProjectDeleted = () => showSuccess(SUCCESS_MESSAGES.PROJECT_DELETED);
  
  const showRoleCreated = () => {
    toast.success(SUCCESS_MESSAGES.ROLE_CREATED, {
      style: {
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '1px solid #22c55e',
        color: '#15803d',
        fontWeight: '600',
        fontSize: '14px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
      },
    });
  };
  
  const showRoleUpdated = () => showSuccess(SUCCESS_MESSAGES.ROLE_UPDATED);
  const showRoleDeleted = () => showSuccess(SUCCESS_MESSAGES.ROLE_DELETED);
  
  const showAssignmentCreated = () => {
    toast.success(SUCCESS_MESSAGES.ASSIGNMENT_CREATED, {
      style: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '1px solid #f59e0b',
        color: '#92400e',
        fontWeight: '600',
        fontSize: '14px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
      },
    });
  };
  
  const showAssignmentUpdated = () => showSuccess(SUCCESS_MESSAGES.ASSIGNMENT_UPDATED);
  const showAssignmentRemoved = () => showSuccess(SUCCESS_MESSAGES.ASSIGNMENT_REMOVED);

  // Predefined error messages
  const showStorageError = () => showError(ERROR_MESSAGES.STORAGE_UNAVAILABLE);
  const showDataExportError = () => showError(ERROR_MESSAGES.DATA_EXPORT_FAILED);
  const showDataImportError = () => showError(ERROR_MESSAGES.DATA_IMPORT_FAILED);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
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
    showStorageError,
    showDataExportError,
    showDataImportError,
  };
}; 