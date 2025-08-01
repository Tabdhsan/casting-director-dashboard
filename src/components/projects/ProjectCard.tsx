// Project card component for grid view

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Folder, FileText, MoreVertical, Edit, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
    project: Project;
    roleCount: number;
    onDoubleClick: () => void;
    onRename?: (project: Project) => void;
    onDelete?: (project: Project) => void;
    isDragging?: boolean;
    isOver?: boolean;
    enableDrag?: boolean;
}

export function ProjectCard({ 
    project, 
    roleCount, 
    onDoubleClick, 
    onRename, 
    onDelete, 
    isDragging, 
    isOver,
    enableDrag = false 
}: ProjectCardProps) {
    // All items are now folders, but we can differentiate by whether they have roles
    const hasRoles = roleCount > 0;
    const Icon = Folder;
    const iconColor = 'text-blue-500';

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ 
        id: project.id,
        disabled: !enableDrag
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            hover={true}
            className={cn(
                'group cursor-pointer transition-all duration-200 hover:shadow-md border',
                'hover:border-primary/20 bg-background',
                (isDragging || isSortableDragging) && 'opacity-50 scale-95',
                isOver && 'ring-2 ring-primary ring-offset-2',
                'select-none h-full flex flex-col min-h-[240px]'
            )}
            onDoubleClick={onDoubleClick}
        >
            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between flex-1">
                    {/* Drag Handle - only visible on hover and when drag is enabled */}
                    {enableDrag && (
                        <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mr-2 mt-1 flex-shrink-0"
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                        {/* Project/Folder Name - Full Width */}
                        <div className="flex items-start space-x-2">
                            <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5', iconColor)} />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                                    {project.name}
                                </h3>
                            </div>
                        </div>
                        
                        {/* Role Count Badge - Separate Row */}
                        <div className="mt-2">
                            <Badge 
                                variant={hasRoles ? "secondary" : "default"}
                                className="text-xs"
                            >
                                {hasRoles ? `${roleCount} role${roleCount !== 1 ? 's' : ''}` : 'Folder'}
                            </Badge>
                        </div>

                        {/* Description */}
                        {project.description && (
                            <p className="mt-3 sm:mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                                {project.description}
                            </p>
                        )}
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 sm:h-7 sm:w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRename?.(project);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(project);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>


            </CardContent>
        </Card>
    );
}