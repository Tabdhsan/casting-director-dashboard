// Folder content panel for tree view showing current folder contents

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjects, useRoles, useAssignments } from '@/hooks/useStore';
import { ProjectCard } from './ProjectCard';
import { RoleCard } from './RoleCard';
import { RenameModal } from './RenameModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface FolderContentPanelProps {
    currentFolderId: string | null;
    onFolderSelect: (folderId: string | null) => void;
    activeId?: string | null;
}

// Droppable content area component
function DroppableContentArea({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
    const { isOver, setNodeRef } = useDroppable({ 
        id: 'content-empty-space',
        disabled: isEmpty
    });
    
    return (
        <div 
            ref={setNodeRef}
            className={cn(
                "min-h-[200px] transition-colors",
                isOver && !isEmpty && "bg-primary/5 rounded-lg border-2 border-dashed border-primary/20"
            )}
        >
            {children}
        </div>
    );
}

export function FolderContentPanel({ currentFolderId, onFolderSelect, activeId }: FolderContentPanelProps) {
    const { projects } = useProjects();
    const { getRolesByProject } = useRoles();
    const { assignments } = useAssignments();

    // Modal states
    const [renameProject, setRenameProject] = useState<Project | null>(null);
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);
    


    // Get current folder info
    const currentFolder = currentFolderId 
        ? projects.find(p => p.id === currentFolderId)
        : null;

    // Get items to display in current folder
    const currentProjects = projects.filter(p => p.parentId === currentFolderId);
    const currentRoles = currentFolderId 
        ? getRolesByProject(currentFolderId)
        : [];

    // Get role assignment counts
    const getRoleAssignmentCount = (roleId: string) => {
        return assignments.filter(a => a.roleId === roleId).length;
    };

    // Get project role count (including nested projects)
    const getProjectRoleCount = (folderId: string) => {
        const projectRoles = getRolesByProject(folderId);
        return projectRoles.length;
    };

    const handleFolderDoubleClick = (project: any) => {
        // Navigate into both folders and projects
        onFolderSelect(project.id);
    };

    const handleRename = (project: Project) => {
        setRenameProject(project);
    };

    const handleDelete = (project: Project) => {
        setDeleteProject(project);
    };

    const handleDeleteComplete = () => {
        // If we deleted the current folder, navigate back to parent
        if (deleteProject && deleteProject.id === currentFolderId) {
            const parentId = deleteProject.parentId || null;
            onFolderSelect(parentId);
        }
    };



    // Combine projects and roles for sortable context
    const allItems = [...currentProjects, ...currentRoles];
    const itemIds = allItems.map(item => item.id);

    return (
        <Card className="h-full hover:shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        {currentFolder ? currentFolder.name : 'All Projects'}
                    </CardTitle>
                    {currentFolder?.description && (
                        <p className="text-sm text-muted-foreground">
                            {currentFolder.description}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                    <DroppableContentArea isEmpty={allItems.length === 0}>
                        {/* Empty state */}
                        {currentProjects.length === 0 && currentRoles.length === 0 && (
                            <div className="flex h-64 items-center justify-center">
                                <div className="text-center">
                                    <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">No items yet</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {currentFolder 
                                            ? 'This folder is empty. Add some projects or roles to get started.'
                                            : 'Create your first folder or project to get started.'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Content grid */}
                        {(currentProjects.length > 0 || currentRoles.length > 0) && (
                            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                                <div className="space-y-6">
                                    {/* Projects/Folders */}
                                    {currentProjects.length > 0 && (
                                        <div>
                                            <h4 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                                Projects
                                            </h4>
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {currentProjects.map((project) => (
                                                    <ProjectCard
                                                        key={project.id}
                                                        project={project}
                                                        roleCount={getProjectRoleCount(project.id)}
                                                        onDoubleClick={() => handleFolderDoubleClick(project)}
                                                        onRename={handleRename}
                                                        onDelete={handleDelete}
                                                        isDragging={activeId === project.id}
                                                        enableDrag={true}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Roles */}
                                    {currentRoles.length > 0 && (
                                        <div>
                                            <h4 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                                Roles
                                            </h4>
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {currentRoles.map((role) => (
                                                    <RoleCard
                                                        key={role.id}
                                                        role={role}
                                                        assignmentCount={getRoleAssignmentCount(role.id)}
                                                        // onDoubleClick={() => {
                                                        //     console.log('Navigate to role:', role.id);
                                                        // }}
                                                        enableDrag={false}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        )}
                    </DroppableContentArea>
                </CardContent>

                {/* Modals */}
                <RenameModal
                    open={!!renameProject}
                    onClose={() => setRenameProject(null)}
                    project={renameProject}
                />
                
                <DeleteConfirmModal
                    open={!!deleteProject}
                    onClose={() => setDeleteProject(null)}
                    project={deleteProject}
                    onDeleted={handleDeleteComplete}
                />
            </Card>
    );
}