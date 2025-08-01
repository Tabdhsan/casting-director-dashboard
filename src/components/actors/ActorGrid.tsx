// Actor grid component with responsive card layout


import { useNavigate } from 'react-router-dom';
import { User, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Actor, ActorFilters } from '@/types';

interface ActorGridProps {
    actors: Actor[];
    filters: ActorFilters;
    onEdit?: (actor: Actor) => void;
    onDelete?: (actor: Actor) => void;
}

interface ActorCardProps {
    actor: Actor;
    onEdit?: (actor: Actor) => void;
    onDelete?: (actor: Actor) => void;
}

function ActorCard({ actor, onEdit, onDelete }: ActorCardProps) {
    const navigate = useNavigate();
    const initials = actor.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <Card 
            className="group cursor-pointer transition-all hover:shadow-md"
            hover={true}
            onClick={() => navigate(`/actors/${actor.id}`)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {/* Avatar and Basic Info */}
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={actor.headshotUrl} alt={actor.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{actor.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {actor.age} • {actor.gender} • {actor.height}
                                </p>
                            </div>
                        </div>

                        {/* Race and Representation */}
                        <div className="mt-3 flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                                {actor.race}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {actor.representation}
                            </Badge>
                        </div>

                        {/* Tags */}
                        {actor.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {actor.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                                {actor.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{actor.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Notes Preview */}
                        {actor.notes && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {actor.notes}
                            </p>
                        )}
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
                                    onEdit?.(actor);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(actor);
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Footer with metadata */}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Added {new Date(actor.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        Actor
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

export function ActorGrid({ actors, filters, onEdit, onDelete }: ActorGridProps) {
    // Filter actors based on search and filters
    const filteredActors = actors.filter(actor => {
        // Search filter
        if (filters.search && !actor.name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // Gender filter
        if (filters.gender && filters.gender.length > 0 && !filters.gender.includes(actor.gender)) {
            return false;
        }

        // Race filter
        if (filters.race && filters.race.length > 0 && !filters.race.includes(actor.race)) {
            return false;
        }

        // Age range filter
        if (filters.ageRange) {
            if (filters.ageRange.min && actor.age < filters.ageRange.min) return false;
            if (filters.ageRange.max && actor.age > filters.ageRange.max) return false;
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some(tag => actor.tags.includes(tag));
            if (!hasMatchingTag) return false;
        }

        return true;
    });



    const handleEdit = (actor: Actor) => {
        onEdit?.(actor);
    };

    const handleDelete = (actor: Actor) => {
        onDelete?.(actor);
    };

    return (
        <div>
            {/* Empty state */}
            {filteredActors.length === 0 && (
                <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <User className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
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
            )}

            {/* Actor Grid */}
            {filteredActors.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredActors.map((actor) => (
                        <ActorCard
                            key={actor.id}
                            actor={actor}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}