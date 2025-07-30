// Modal for customizing status buckets

import { useState, useEffect } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Plus, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useRoles } from '@/hooks/useStore';
import type { Role, StatusBucket } from '@/types';

interface BucketSettingsModalProps {
    open: boolean;
    onClose: () => void;
    role: Role;
}

interface SortableBucketItemProps {
    bucket: StatusBucket;
    onEdit: (bucket: StatusBucket) => void;
    onDelete: (bucketId: string) => void;
}

const PRESET_COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#6b7280', // gray
    '#1f2937', // dark gray
];

function ColorPicker({ color, onChange }: { color: string; onChange: (color: string) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                    <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: color }}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-5 gap-2">
                    {PRESET_COLORS.map((presetColor) => (
                        <button
                            key={presetColor}
                            className="w-8 h-8 rounded-full border-2 border-transparent hover:border-primary"
                            style={{ backgroundColor: presetColor }}
                            onClick={() => onChange(presetColor)}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function SortableBucketItem({ bucket, onEdit, onDelete }: SortableBucketItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: bucket.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center space-x-3 p-3 bg-background border rounded-lg ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: bucket.color }}
            />
            
            <div className="flex-1">
                <p className="font-medium">{bucket.name}</p>
            </div>
            
            <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(bucket)}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(bucket.id)}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function BucketSettingsModal({ open, onClose, role }: BucketSettingsModalProps) {
    const { updateRole } = useRoles();
    const [buckets, setBuckets] = useState<StatusBucket[]>([]);
    const [editingBucket, setEditingBucket] = useState<StatusBucket | null>(null);
    const [newBucketName, setNewBucketName] = useState('');
    const [newBucketColor, setNewBucketColor] = useState(PRESET_COLORS[0]);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setBuckets([...role.customBuckets].sort((a, b) => a.order - b.order));
        }
    }, [open, role.customBuckets]);

    const handleAddBucket = () => {
        if (!newBucketName.trim()) return;

        const newBucket: StatusBucket = {
            id: `bucket-${Date.now()}`,
            name: newBucketName.trim(),
            color: newBucketColor,
            order: buckets.length,
        };

        setBuckets([...buckets, newBucket]);
        setNewBucketName('');
        setNewBucketColor(PRESET_COLORS[0]);
    };

    const handleEditBucket = (bucket: StatusBucket) => {
        setEditingBucket(bucket);
        setNewBucketName(bucket.name);
        setNewBucketColor(bucket.color);
    };

    const handleUpdateBucket = () => {
        if (!editingBucket || !newBucketName.trim()) return;

        setBuckets(buckets.map(bucket =>
            bucket.id === editingBucket.id
                ? { ...bucket, name: newBucketName.trim(), color: newBucketColor }
                : bucket
        ));

        setEditingBucket(null);
        setNewBucketName('');
        setNewBucketColor(PRESET_COLORS[0]);
    };

    const handleDeleteBucket = (bucketId: string) => {
        setBuckets(buckets.filter(bucket => bucket.id !== bucketId));
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = buckets.findIndex(bucket => bucket.id === active.id);
        const newIndex = buckets.findIndex(bucket => bucket.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newBuckets = [...buckets];
            const [movedBucket] = newBuckets.splice(oldIndex, 1);
            newBuckets.splice(newIndex, 0, movedBucket);

            // Update order values
            const updatedBuckets = newBuckets.map((bucket, index) => ({
                ...bucket,
                order: index,
            }));

            setBuckets(updatedBuckets);
        }
    };

    const handleSave = () => {
        updateRole(role.id, {
            customBuckets: buckets,
        });
        onClose();
    };

    const handleClose = () => {
        setEditingBucket(null);
        setNewBucketName('');
        setNewBucketColor(PRESET_COLORS[0]);
        onClose();
    };

    const draggedBucket = activeId ? buckets.find(b => b.id === activeId) : null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Bucket Settings</DialogTitle>
                    <DialogDescription>
                        Customize the status buckets for {role.name}. Drag to reorder.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Add/Edit Bucket Form */}
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                        <Label>
                            {editingBucket ? 'Edit Bucket' : 'Add New Bucket'}
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="Bucket name"
                                value={newBucketName}
                                onChange={(e) => setNewBucketName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        editingBucket ? handleUpdateBucket() : handleAddBucket();
                                    }
                                }}
                            />
                            <ColorPicker
                                color={newBucketColor}
                                onChange={setNewBucketColor}
                            />
                            <Button
                                onClick={editingBucket ? handleUpdateBucket : handleAddBucket}
                                disabled={!newBucketName.trim()}
                                size="sm"
                            >
                                {editingBucket ? 'Update' : <Plus className="h-4 w-4" />}
                            </Button>
                        </div>
                        {editingBucket && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setEditingBucket(null);
                                    setNewBucketName('');
                                    setNewBucketColor(PRESET_COLORS[0]);
                                }}
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>

                    {/* Existing Buckets */}
                    <div className="space-y-2">
                        <Label>Current Buckets ({buckets.length})</Label>
                        {buckets.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No buckets yet. Add one above to get started.
                            </div>
                        ) : (
                            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                                <SortableContext items={buckets.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-2">
                                        {buckets.map((bucket) => (
                                            <SortableBucketItem
                                                key={bucket.id}
                                                bucket={bucket}
                                                onEdit={handleEditBucket}
                                                onDelete={handleDeleteBucket}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {draggedBucket && (
                                        <div className="flex items-center space-x-3 p-3 bg-background border rounded-lg shadow-lg opacity-90">
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            <div 
                                                className="w-4 h-4 rounded-full" 
                                                style={{ backgroundColor: draggedBucket.color }}
                                            />
                                            <p className="font-medium">{draggedBucket.name}</p>
                                        </div>
                                    )}
                                </DragOverlay>
                            </DndContext>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}