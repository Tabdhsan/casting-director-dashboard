// Grid view component for Google Drive-style project browsing

import { useState } from 'react';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Folder, FileText } from 'lucide-react';
import { useProjects, useRoles, useAssignments } from '@/hooks/useStore';
import { ProjectCard } from './ProjectCard';
import { RoleCard } from './RoleCard';
import { RenameModal } from './RenameModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface GridViewProps {
    currentFolderId: string | null;
    onFolderSelect: (folderId: string | null) => void;
}

// Droppable empty space component
function DroppableGridArea({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
    const { isOver, setNodeRef } = useDroppable({ 
        id: 'grid-empty-space',
        disabled: isEmpty // Only enable when there are items to avoid conflicts
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

export function GridView({ currentFolderId, onFolderSelect }: GridViewProps) {
    const { projects, updateProject } = useProjects();
    const { getRolesByProject } = useRoles();
    const { assignments } = useAssignments();
    
    // Modal states
    const [renameProject, setRenameProject] = useState<Project | null>(null);
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);
    
    // Drag states
    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<Project | null>(null);
    const [overId, setOverId] = useState<string | null>(null);

    // Get items to display in current folder
    const currentProjects = projects.filter(p => 
        currentFolderId === null 
            ? (p.parentId === null || p.parentId === undefined)
            : p.parentId === currentFolderId
    );
    const currentRoles = currentFolderId 
        ? getRolesByProject(currentFolderId)
        : [];

    // Items filtered for current folder

    // Combine projects and roles for display
    const allItems = [...currentProjects, ...currentRoles];
    const itemIds = allItems.map(item => item.id);

    // Get role assignment counts
    const getRoleAssignmentCount = (roleId: string) => {
        return assignments.filter(a => a.roleId === roleId).length;
    };

    // Get project role count (including nested projects)
    const getProjectRoleCount = (projectId: string) => {
        const projectRoles = getRolesByProject(projectId);
        return projectRoles.length;
    };

    const handleFolderDoubleClick = (project: Project) => {
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

    // Drag and drop handlers
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        
        // Find the dragged item (only projects can be dragged)
        const project = currentProjects.find(p => p.id === active.id);
        if (project) {
            setDraggedItem(project);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        setOverId(over ? over.id as string : null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveId(null);
        setDraggedItem(null);
        setOverId(null);
        
        if (!over || active.id === over.id) {
            return;
        }

        const draggedProject = currentProjects.find(p => p.id === active.id);
        if (!draggedProject) return;

        // Handle different drop targets
        if (over.id === 'breadcrumb-root') {
            // Drop on root breadcrumb - move to root level
            updateProject(draggedProject.id, { parentId: undefined });
        } else if (over.id === 'breadcrumb-current') {
            // Drop on current folder breadcrumb - do nothing (can't drop into itself)
            return;
        } else if (over.id === 'grid-empty-space') {
            // Drop on empty space - move to parent of current folder
            const currentFolder = projects.find(p => p.id === currentFolderId);
            const parentId = currentFolder?.parentId || undefined;
            updateProject(draggedProject.id, { parentId });
        } else if (over.id.startsWith('breadcrumb-')) {
            // Drop on specific breadcrumb item - move INTO that folder
            const breadcrumbId = over.id.replace('breadcrumb-', '');
            updateProject(draggedProject.id, { parentId: breadcrumbId });
        } else {
            // Drop on another project/folder in the current view
            const targetProject = currentProjects.find(p => p.id === over.id);
            if (targetProject && targetProject.type === 'folder' && targetProject.id !== draggedProject.id) {
                // Move into the target folder
                updateProject(draggedProject.id, { parentId: targetProject.id });
            }
        }
    };

    return (
        <DndContext 
            onDragStart={handleDragStart} 
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full overflow-auto">
                <DroppableGridArea isEmpty={allItems.length === 0}>
                    {/* Empty state */}
                    {allItems.length === 0 && (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-center">
                                <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">No items yet</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Create your first folder or role to get started.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Grid of items */}
                    {allItems.length > 0 && (
                        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
                                {currentProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        roleCount={getProjectRoleCount(project.id)}
                                        onDoubleClick={() => handleFolderDoubleClick(project)}
                                        onRename={handleRename}
                                        onDelete={handleDelete}
                                        isDragging={activeId === project.id}
                                        isOver={overId === project.id}
                                        enableDrag={true}
                                    />
                                ))}
                                
                                {currentRoles.map((role) => (
                                    <RoleCard
                                        key={role.id}
                                        role={role}
                                        assignmentCount={getRoleAssignmentCount(role.id)}
                                        onDoubleClick={() => {
                                            // Navigate to role detail page
                                            console.log('Navigate to role:', role.id);
                                        }}
                                        enableDrag={false} // Roles don't need drag for now
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    )}
                </DroppableGridArea>
            </div>

            {/* Drag overlay */}
            <DragOverlay>
                {draggedItem && (
                    <div className="rounded-lg border bg-background p-4 shadow-lg opacity-90">
                        <div className="flex items-center space-x-3">
                            {draggedItem.type === 'folder' ? (
                                <Folder className="h-8 w-8 text-blue-500" />
                            ) : (
                                <FileText className="h-8 w-8 text-green-500" />
                            )}
                            <div>
                                <p className="font-medium">{draggedItem.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {draggedItem.type === 'folder' ? 'Folder' : 'Project'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            Drop on breadcrumb to move into that folder
                        </div>
                    </div>
                )}
            </DragOverlay>

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
        </DndContext>
    );
}