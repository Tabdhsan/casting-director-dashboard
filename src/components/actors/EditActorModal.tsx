// Edit Actor modal component with inline editing capabilities

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useActors } from '@/hooks/useStore';
import { useToast } from '@/hooks/useToast';
import { GENDER_OPTIONS, RACE_OPTIONS, COMMON_TAGS } from '@/types/constants';
import type { Actor, UpdateActorInput } from '@/types';

// Form validation schema
const editActorSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
    gender: z.string().min(1, 'Gender is required'),
    race: z.string().min(1, 'Race is required'),
    height: z.string().min(1, 'Height is required'),
    representation: z.string().min(1, 'Representation is required'),
    tags: z.array(z.string()).default([]),
    notes: z.string().default(''),
    headshotUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    resumeUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type EditActorFormData = z.infer<typeof editActorSchema>;

interface EditActorModalProps {
    actor: Actor | null;
    open: boolean;
    onClose: () => void;
}

export function EditActorModal({ actor, open, onClose }: EditActorModalProps) {
    const { updateActor } = useActors();
    const toast = useToast();
    
    const [selectedTags, setSelectedTags] = useState<string[]>(actor?.tags || []);
    const [customTag, setCustomTag] = useState('');

    const form = useForm<EditActorFormData>({
        resolver: zodResolver(editActorSchema) as any,
        defaultValues: {
            name: actor?.name || '',
            age: actor?.age || 25,
            gender: actor?.gender || '',
            race: actor?.race || '',
            height: actor?.height || '',
            representation: actor?.representation || '',
            tags: actor?.tags || [],
            notes: actor?.notes || '',
            headshotUrl: actor?.headshotUrl || '',
            resumeUrl: actor?.resumeUrl || '',
        },
    });

    // Update form when actor changes
    useEffect(() => {
        if (actor) {
            form.reset({
                name: actor.name,
                age: actor.age,
                gender: actor.gender,
                race: actor.race,
                height: actor.height,
                representation: actor.representation,
                tags: actor.tags,
                notes: actor.notes,
                headshotUrl: actor.headshotUrl || '',
                resumeUrl: actor.resumeUrl || '',
            });
            setSelectedTags(actor.tags);
        }
    }, [actor, form]);

    const onSubmit = (data: EditActorFormData) => {
        if (!actor) return;

        const actorUpdates: UpdateActorInput = {
            ...data,
            tags: selectedTags,
            headshotUrl: data.headshotUrl || undefined,
            resumeUrl: data.resumeUrl || undefined,
        };

        try {
            updateActor(actor.id, actorUpdates);
            toast.showActorUpdated();
            onClose();
        } catch (error) {
            toast.showError('Failed to update actor');
        }
    };

    const handleClose = () => {
        setCustomTag('');
        onClose();
    };

    const addTag = (tag: string) => {
        if (tag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const addCustomTag = () => {
        if (customTag.trim()) {
            addTag(customTag.trim());
            setCustomTag('');
        }
    };

    if (!actor) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Actor</DialogTitle>
                    <DialogDescription>
                        Update {actor.name}'s information and details.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Basic Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter actor's full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control as any}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Age</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="25"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {GENDER_OPTIONS.map((gender) => (
                                                        <SelectItem key={gender} value={gender}>
                                                            {gender}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control as any}
                                    name="race"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Race/Ethnicity</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select race/ethnicity" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {RACE_OPTIONS.map((race) => (
                                                        <SelectItem key={race} value={race}>
                                                            {race}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Height</FormLabel>
                                            <FormControl>
                                                <Input placeholder="5'8&quot;" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter height in feet and inches (e.g., 5'8")
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control as any}
                                    name="representation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Representation</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select representation" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="SAG-AFTRA">SAG-AFTRA</SelectItem>
                                                    <SelectItem value="AEA">AEA</SelectItem>
                                                    <SelectItem value="Non-Union">Non-Union</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Tags & Specialties</h3>

                            {/* Selected Tags */}
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-sm">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-2 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Common Tags */}
                            <div>
                                <Label className="text-sm font-medium">Common Tags</Label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {COMMON_TAGS.map((tag) => (
                                        <Button
                                            key={tag}
                                            type="button"
                                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => selectedTags.includes(tag) ? removeTag(tag) : addTag(tag)}
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Tag Input */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add custom tag..."
                                    value={customTag}
                                    onChange={(e) => setCustomTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                                />
                                <Button type="button" onClick={addCustomTag} variant="outline">
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* Files */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Files & Media</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="headshotUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Headshot URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/headshot.jpg" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                URL to actor's headshot image
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control as any}
                                    name="resumeUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resume URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/resume.pdf" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                URL to actor's resume/CV
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <FormField
                            control={form.control as any}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional notes about the actor..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Any additional information, special skills, or notes
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}