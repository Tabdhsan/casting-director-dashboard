// Delete Actor confirmation modal

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useActors, useAssignments } from '@/hooks/useStore';
import { useToast } from '@/hooks/useToast';
import type { Actor } from '@/types';

interface DeleteActorModalProps {
    actor: Actor | null;
    open: boolean;
    onClose: () => void;
    onDeleted?: () => void;
}

export function DeleteActorModal({ actor, open, onClose, onDeleted }: DeleteActorModalProps) {
    const { deleteActor } = useActors();
    const { getActorRoleHistory } = useAssignments();
    const toast = useToast();

    if (!actor) return null;

    const roleHistory = getActorRoleHistory(actor.id);
    const hasAssignments = roleHistory.length > 0;

    const handleDelete = () => {
        deleteActor(actor.id);
        toast.showActorDeleted();
        onDeleted?.();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <DialogTitle>Delete Actor</DialogTitle>
                    </div>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{actor.name}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {hasAssignments && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-destructive">Warning</p>
                                <p className="text-muted-foreground mt-1">
                                    This actor is currently assigned to {roleHistory.length} role{roleHistory.length !== 1 ? 's' : ''}. 
                                    Deleting this actor will remove all their role assignments.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete Actor
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}