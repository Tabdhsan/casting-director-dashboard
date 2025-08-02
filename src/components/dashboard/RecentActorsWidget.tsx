// Recent actors widget showing recently added actors

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Actor } from '@/types';

interface RecentActorsWidgetProps {
    actors: Actor[];
}

export function RecentActorsWidget({ actors }: RecentActorsWidgetProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Actors</CardTitle>
            </CardHeader>
            <CardContent>
                {actors.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No actors added yet
                    </p>
                ) : (
                    <div className="space-y-4">
                        {actors.map((actor) => (
                            <div key={actor.id} className="flex items-center space-x-4">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={actor.headshotUrl} alt={actor.name} />
                                    <AvatarFallback>{getInitials(actor.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {actor.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {actor.ageRange.min}-{actor.ageRange.max} • {actor.gender} • {actor.unionStatus}
                                        {actor.representation && ` • ${actor.representation.agency}`}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatDate(actor.createdAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}