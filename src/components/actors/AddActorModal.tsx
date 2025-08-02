// Add Actor modal component with comprehensive form fields

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { GENDER_OPTIONS, ETHNIC_APPEARANCE_OPTIONS, COMMON_TAGS } from '@/types/constants';
import type { CreateActorInput } from '@/types';

// Form validation schema
const addActorSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    ageRange: z.object({
        min: z.number().min(1, 'Minimum age must be at least 1').max(120, 'Minimum age must be less than 120'),
        max: z.number().min(1, 'Maximum age must be at least 1').max(120, 'Maximum age must be less than 120')
    }).refine(data => data.min <= data.max, {
        message: "Minimum age must be less than or equal to maximum age",
        path: ["min"]
    }),
    gender: z.string().min(1, 'Gender is required'),
    ethnicAppearance: z.array(z.string()).min(1, 'At least one ethnic appearance must be selected'),
    height: z.string().min(1, 'Height is required'),
    unionStatus: z.string().min(1, 'Union Status is required'),
    tags: z.array(z.string()).default([]),
    notes: z.string().default(''),
    headshotUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    resumeUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type AddActorFormData = z.infer<typeof addActorSchema>;

interface AddActorModalProps {
    open: boolean;
    onClose: () => void;
}

export function AddActorModal({ open, onClose }: AddActorModalProps) {
    const { addActor } = useActors();
    const toast = useToast();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customTag, setCustomTag] = useState('');

    const form = useForm<AddActorFormData>({
        resolver: zodResolver(addActorSchema) as any,
        defaultValues: {
            name: '',
            ageRange: { min: 18, max: 65 },
            gender: '',
            ethnicAppearance: [],
            height: '',
            unionStatus: '',
            tags: [],
            notes: '',
            headshotUrl: '',
            resumeUrl: '',
        },
    });

    const onSubmit = (data: AddActorFormData) => {
        const actorData: CreateActorInput = {
            ...data,
            tags: selectedTags,
            headshotUrl: data.headshotUrl || undefined,
            resumeUrl: data.resumeUrl || undefined,
        };

        try {
            addActor(actorData);
            toast.showActorCreated();
            handleClose();
        } catch (error) {
            toast.showError('Failed to add actor');
        }
    };

    const handleClose = () => {
        form.reset();
        setSelectedTags([]);
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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Actor</DialogTitle>
                    <DialogDescription>
                        Add a new actor to your database with their details and information.
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

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control as any}
                                        name="ageRange.min"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Min Age</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="18" 
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control as any}
                                        name="ageRange.max"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Max Age</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="65" 
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    name="ethnicAppearance"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ethnic Appearance</FormLabel>
                                            <div className="grid grid-cols-2 gap-3 mt-2">
                                                {ETHNIC_APPEARANCE_OPTIONS.map((option) => (
                                                    <div key={option} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`ethnic-${option}`}
                                                            checked={field.value?.includes(option) || false}
                                                            onCheckedChange={(checked) => {
                                                                const currentValue = field.value || [];
                                                                if (checked) {
                                                                    field.onChange([...currentValue, option]);
                                                                } else {
                                                                    field.onChange(currentValue.filter((v) => v !== option));
                                                                }
                                                            }}
                                                        />
                                                        <Label 
                                                            htmlFor={`ethnic-${option}`}
                                                            className="text-sm font-normal cursor-pointer"
                                                        >
                                                            {option}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
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
                                    name="unionStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Union Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select union status" />
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

                            {/* File Upload Placeholder */}
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            File upload functionality coming soon
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            For now, please use URLs above
                                        </p>
                                    </div>
                                </div>
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
                                {form.formState.isSubmitting ? 'Adding...' : 'Add Actor'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}