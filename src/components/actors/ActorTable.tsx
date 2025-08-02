// Actor table component with sortable columns and inline editing

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Actor, ActorFilters } from '@/types';

interface ActorTableProps {
    actors: Actor[];
    filters: ActorFilters;
    onEdit?: (actor: Actor) => void;
    onDelete?: (actor: Actor) => void;
}

type SortField = 'name' | 'ageRange' | 'gender' | 'height' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function ActorTable({ actors, filters, onEdit, onDelete }: ActorTableProps) {
    const navigate = useNavigate();
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Filter and sort actors
    const filteredAndSortedActors = useMemo(() => {
        // First filter
        let filtered = actors.filter(actor => {
            // Search filter
            if (filters.search && !actor.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            // Gender filter
            if (filters.gender && filters.gender.length > 0 && !filters.gender.includes(actor.gender)) {
                return false;
            }

            // Ethnic Appearance filter
            if (filters.ethnicAppearance && filters.ethnicAppearance.length > 0) {
                const hasMatchingAppearance = filters.ethnicAppearance.some(appearance => 
                    actor.ethnicAppearance.includes(appearance)
                );
                if (!hasMatchingAppearance) return false;
            }

                    // Age range filter - check if actor's age range overlaps with filter range
        if (filters.ageRange) {
            if (filters.ageRange.min && actor.ageRange.max < filters.ageRange.min) return false;
            if (filters.ageRange.max && actor.ageRange.min > filters.ageRange.max) return false;
        }

            // Tags filter
            if (filters.tags && filters.tags.length > 0) {
                const hasMatchingTag = filters.tags.some(tag => actor.tags.includes(tag));
                if (!hasMatchingTag) return false;
            }

            return true;
        });

        // Then sort
        filtered.sort((a, b) => {
            let aValue: any = a[sortField];
            let bValue: any = b[sortField];

            // Handle date fields
            if (sortField === 'createdAt') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            // Handle age range fields - sort by minimum age
            if (sortField === 'ageRange') {
                aValue = a.ageRange.min;
                bValue = b.ageRange.min;
            }

            // // Handle ethnic appearance fields - sort by first appearance
            // if (sortField === 'ethnicAppearance') {
            //     aValue = a.ethnicAppearance[0] || '';
            //     bValue = b.ethnicAppearance[0] || '';
            // }

            // Handle string fields
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [actors, filters, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };



    const handleEdit = (actor: Actor) => {
        onEdit?.(actor);
    };

    const handleDelete = (actor: Actor) => {
        onDelete?.(actor);
    };

    const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <TableHead>
            <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium hover:bg-transparent"
                onClick={() => handleSort(field)}
            >
                {children}
                {sortField === field && (
                    sortDirection === 'asc' ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )
                )}
            </Button>
        </TableHead>
    );

    return (
        <div>
            {filteredAndSortedActors.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-lg font-medium">
                            {actors.length === 0 ? 'No actors yet' : 'No actors found'}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {actors.length === 0
                                ? 'Add your first actor to get started.'
                                : 'Try adjusting your search or filters.'
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <SortableHeader field="name">Name</SortableHeader>
                                <SortableHeader field="ageRange">Age Range</SortableHeader>
                                <SortableHeader field="gender">Gender</SortableHeader>
                                {/* <SortableHeader field="ethnicAppearance">Ethnic Appearance</SortableHeader> */}
                                <SortableHeader field="height">Height</SortableHeader>
                                <TableHead>Union Status</TableHead>
                                <TableHead>Representation</TableHead>
                                <TableHead>Tags</TableHead>
                                <SortableHeader field="createdAt">Added</SortableHeader>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedActors.map((actor) => {
                                const initials = actor.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .toUpperCase();

                                return (
                                    <TableRow
                                        key={actor.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => navigate(`/actors/${actor.id}`)}
                                    >
                                        <TableCell>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={actor.headshotUrl} alt={actor.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{actor.name}</TableCell>
                                        <TableCell>{actor.ageRange.min}-{actor.ageRange.max}</TableCell>
                                        <TableCell>{actor.gender}</TableCell>
                                        {/* <TableCell>{actor.ethnicAppearance.join(', ')}</TableCell> */}
                                        <TableCell>{actor.height}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {actor.unionStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {actor.representation && (
                                                <div className="text-sm">
                                                    <div className="font-medium">{actor.representation.agency}</div>
                                                    <div className="text-xs text-muted-foreground">{actor.representation.agent}</div>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {actor.tags.slice(0, 2).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {actor.tags.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{actor.tags.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(actor.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
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
                                                            navigate(`/actors/${actor.id}`);
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(actor);
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(actor);
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}