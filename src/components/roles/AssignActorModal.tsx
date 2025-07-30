// Modal for assigning actors to roles

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAssignments } from '@/hooks/useStore';
import type { Role, Actor } from '@/types';

interface AssignActorModalProps {
    open: boolean;
    onClose: () => void;
    role: Role;
    availableActors: Actor[];
}

export function AssignActorModal({ open, onClose, role, availableActors }: AssignActorModalProps) {
    const { assignActorToRole } = useAssignments();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedActors, setSelectedActors] = useState<string[]>([]);
    const [selectedBucket, setSelectedBucket] = useState<string>('');
    const [notes, setNotes] = useState('');

    // Set default bucket when modal opens
    useEffect(() => {
        if (open && role.customBuckets.length > 0 && !selectedBucket) {
            const defaultBucket = role.customBuckets.sort((a, b) => a.order - b.order)[0].id;
            setSelectedBucket(defaultBucket);
        }
    }, [open, role.customBuckets, selectedBucket]);

    // Filter actors based on search term
    const filteredActors = availableActors.filter(actor =>
        actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleActorToggle = (actorId: string) => {
        setSelectedActors(prev =>
            prev.includes(actorId)
                ? prev.filter(id => id !== actorId)
                : [...prev, actorId]
        );
    };

    const handleAssign = () => {
        if (selectedActors.length === 0 || !selectedBucket) return;

        selectedActors.forEach(actorId => {
            assignActorToRole({
                actorId,
                roleId: role.id,
                bucketId: selectedBucket,
                notes: notes.trim() || undefined,
            });
        });

        handleClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        setSelectedActors([]);
        setSelectedBucket('');
        setNotes('');
        onClose();
    };

    // Set default bucket to first one if not selected
    const defaultBucket = role.customBuckets.length > 0 ? role.customBuckets.sort((a, b) => a.order - b.order)[0].id : '';
    const currentBucket = selectedBucket || defaultBucket;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Assign Actors to {role.name}</DialogTitle>
                    <DialogDescription>
                        Select actors to assign to this role and choose their initial status.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search actors by name or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Bucket Selection */}
                    <div className="space-y-2">
                        <Label>Initial Status</Label>
                        <Select value={currentBucket} onValueChange={setSelectedBucket}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select initial status bucket" />
                            </SelectTrigger>
                            <SelectContent>
                                {role.customBuckets
                                    .sort((a, b) => a.order - b.order)
                                    .map((bucket) => (
                                        <SelectItem key={bucket.id} value={bucket.id}>
                                            <div className="flex items-center space-x-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: bucket.color }}
                                                />
                                                <span>{bucket.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                            placeholder="Add notes about this assignment..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[80px]"
                        />
                    </div>

                    {/* Actor List */}
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <Label>Available Actors ({filteredActors.length})</Label>
                            {selectedActors.length > 0 && (
                                <Badge variant="secondary">
                                    {selectedActors.length} selected
                                </Badge>
                            )}
                        </div>
                        
                        <div className="overflow-y-auto max-h-[300px] space-y-2 border rounded-md p-2">
                            {filteredActors.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? 'No actors match your search' : 'No available actors'}
                                </div>
                            ) : (
                                filteredActors.map((actor) => (
                                    <div
                                        key={actor.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                                        onClick={() => handleActorToggle(actor.id)}
                                    >
                                        <Checkbox
                                            checked={selectedActors.includes(actor.id)}
                                            onCheckedChange={() => handleActorToggle(actor.id)}
                                        />
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={actor.headshotUrl} />
                                            <AvatarFallback>
                                                {actor.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium">{actor.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {actor.age} • {actor.gender} • {actor.height}
                                            </p>
                                            {actor.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {actor.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
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
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAssign}
                        disabled={selectedActors.length === 0 || !currentBucket}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Assign {selectedActors.length > 0 ? `${selectedActors.length} ` : ''}Actor{selectedActors.length !== 1 ? 's' : ''}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}