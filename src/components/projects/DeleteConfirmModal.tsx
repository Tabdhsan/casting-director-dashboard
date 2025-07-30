// Confirmation modal for deleting folders and projects

import { AlertTriangle, Folder, FileText } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProjects, useRoles, useAssignments } from '@/hooks/useStore';
import { useToast } from '@/hooks/useToast';
import type { Project } from '@/types';

interface DeleteConfirmModalProps {
    open: boolean;
    onClose: () => void;
    project: Project | null;
    onDeleted?: () => void;
}

export function DeleteConfirmModal({ open, onClose, project, onDeleted }: DeleteConfirmModalProps) {
    const { projects, deleteProject } = useProjects();
    const { getRolesByProject } = useRoles();
    const { assignments } = useAssignments();
    const toast = useToast();

    if (!project) return null;

    const handleDelete = () => {
        try {
            deleteProject(project.id);
            toast.showProjectDeleted();
            onDeleted?.();
            onClose();
        } catch (error) {
            toast.showError('Failed to delete project');
        }
    };

    const handleClose = () => {
        onClose();
    };

    const isFolder = project.type === 'folder';
    const Icon = isFolder ? Folder : FileText;

    // Calculate what will be deleted
    const childProjects = projects.filter(p => p.parentId === project.id);
    const projectRoles = getRolesByProject(project.id);
    const roleAssignments = assignments.filter(a => 
        projectRoles.some(role => role.id === a.roleId)
    );

    const hasChildren = childProjects.length > 0;
    const hasRoles = projectRoles.length > 0;
    const hasAssignments = roleAssignments.length > 0;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Delete {isFolder ? 'Folder' : 'Project'}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{project.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <div className="flex items-start space-x-3">
                            <Icon className="h-8 w-8 text-destructive mt-1" />
                            <div className="flex-1">
                                <h4 className="font-medium text-destructive">
                                    {project.name}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {project.description || `${isFolder ? 'Folder' : 'Project'} will be permanently deleted`}
                                </p>

                                {/* Warning about what will be deleted */}
                                {(hasChildren || hasRoles || hasAssignments) && (
                                    <div className="mt-3 space-y-1 text-sm text-destructive">
                                        <p className="font-medium">This will also delete:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            {hasChildren && (
                                                <li>{childProjects.length} nested {childProjects.length === 1 ? 'item' : 'items'}</li>
                                            )}
                                            {hasRoles && (
                                                <li>{projectRoles.length} {projectRoles.length === 1 ? 'role' : 'roles'}</li>
                                            )}
                                            {hasAssignments && (
                                                <li>{roleAssignments.length} actor {roleAssignments.length === 1 ? 'assignment' : 'assignments'}</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}