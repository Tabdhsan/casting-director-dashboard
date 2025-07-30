// Role card component for grid view

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { Users, MoreVertical, Edit, Trash2, UserPlus, GripVertical } from 'lucide-react';
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
import type { Role } from '@/types';

interface RoleCardProps {
    role: Role;
    assignmentCount: number;
    onDoubleClick?: () => void;
    isDragging?: boolean;
    isOver?: boolean;
    enableDrag?: boolean;
}

export function RoleCard({ 
    role, 
    assignmentCount, 
    onDoubleClick,
    isDragging, 
    isOver,
    enableDrag = false 
}: RoleCardProps) {
    const navigate = useNavigate();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ 
        id: role.id,
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
            className={cn(
                'group cursor-pointer transition-all hover:shadow-md',
                (isDragging || isSortableDragging) && 'opacity-50',
                isOver && 'ring-2 ring-primary ring-offset-2',
                'select-none'
            )}
            onDoubleClick={() => {
                if (onDoubleClick) {
                    onDoubleClick();
                } else {
                    navigate(`/projects/${role.projectId}/roles/${role.id}`);
                }
            }}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    {/* Drag Handle - only visible on hover and when drag is enabled */}
                    {enableDrag && (
                        <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mr-2 mt-1"
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    
                    <div className="flex-1">
                        {/* Icon and Name */}
                        <div className="flex items-center space-x-3">
                            <Users className="h-8 w-8 text-purple-500" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{role.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {assignmentCount} actor{assignmentCount !== 1 ? 's' : ''} assigned
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {role.description && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {role.description}
                            </p>
                        )}

                        {/* Status Buckets */}
                        <div className="mt-3 flex flex-wrap gap-1">
                            {role.customBuckets.slice(0, 3).map((bucket) => (
                                <Badge
                                    key={bucket.id}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {bucket.name}
                                </Badge>
                            ))}
                            {role.customBuckets.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{role.customBuckets.length - 3}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/projects/${role.projectId}/roles/${role.id}`)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign Actors
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Footer with metadata */}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {new Date(role.updatedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        Role
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}