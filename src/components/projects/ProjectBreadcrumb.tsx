// Breadcrumb navigation component for project hierarchy

import { ChevronRight, Home } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useStore';
import { cn } from '@/lib/utils';

interface ProjectBreadcrumbProps {
    currentFolderId: string | null;
    onNavigate: (folderId: string | null) => void;
}

// Droppable breadcrumb item component
function DroppableBreadcrumbItem({ 
    id, 
    children, 
    onClick,
    disabled = false
}: { 
    id: string; 
    children: React.ReactNode; 
    onClick: () => void;
    disabled?: boolean;
}) {
    const { isOver, setNodeRef } = useDroppable({ 
        id,
        disabled 
    });
    
    return (
        <Button
            ref={setNodeRef}
            variant="ghost"
            size="sm"
            className={cn(
                "h-auto p-1 text-muted-foreground hover:text-foreground transition-colors",
                isOver && "bg-primary/10 text-primary border-2 border-dashed border-primary/30 rounded-md"
            )}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

export function ProjectBreadcrumb({ currentFolderId, onNavigate }: ProjectBreadcrumbProps) {
    const { getProjectBreadcrumb } = useProjects();

    // Get breadcrumb path
    const breadcrumbPath = currentFolderId 
        ? getProjectBreadcrumb(currentFolderId)
        : [];

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            {/* Home/Root */}
            <DroppableBreadcrumbItem
                id="breadcrumb-root"
                onClick={() => onNavigate(null)}
            >
                <Home className="h-4 w-4" />
                <span className="ml-1">Projects</span>
            </DroppableBreadcrumbItem>

            {/* Breadcrumb items */}
            {breadcrumbPath.map((project, index) => {
                // Don't show the current folder as a drop target (can't drop into itself)
                const isCurrentFolder = index === breadcrumbPath.length - 1;
                
                return (
                    <div key={project.id} className="flex items-center space-x-1">
                        <ChevronRight className="h-4 w-4" />
                        <DroppableBreadcrumbItem
                            id={isCurrentFolder ? 'breadcrumb-current' : `breadcrumb-${project.id}`}
                            onClick={() => onNavigate(project.id)}
                            disabled={isCurrentFolder}
                        >
                            {project.name}
                        </DroppableBreadcrumbItem>
                    </div>
                );
            })}
        </nav>
    );
}