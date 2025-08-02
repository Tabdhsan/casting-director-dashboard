// Actor filters sidebar with multi-select filters

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useActors } from '@/hooks/useStore';

import type { ActorFilters as ActorFiltersType } from '@/types';

interface ActorFiltersProps {
    filters: ActorFiltersType;
    onFiltersChange: (filters: ActorFiltersType) => void;
    onClose: () => void;
}

export function ActorFilters({ filters, onFiltersChange, onClose }: ActorFiltersProps) {
    const { getFilterOptions } = useActors();
    const [localFilters, setLocalFilters] = useState<ActorFiltersType>(filters);
    const [expandedSections, setExpandedSections] = useState({
        gender: true,
        age: true,
        ethnicAppearance: true,
        height: false,
        unionStatus: false,
        tags: false,
    });

    // Get available filter options from the store
    const filterOptions = getFilterOptions();

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Apply filters
    const applyFilters = () => {
        onFiltersChange(localFilters);
    };

    // Clear all filters
    const clearFilters = () => {
        const emptyFilters: ActorFiltersType = {};
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    // Toggle section expansion
    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Handle multi-select filter changes
    const handleMultiSelectChange = (
        field: 'gender' | 'ethnicAppearance' | 'height' | 'unionStatus' | 'tags',
        value: string,
        checked: boolean
    ) => {
        setLocalFilters(prev => {
            const currentValues = prev[field] || [];
            const newValues = checked
                ? [...currentValues, value]
                : currentValues.filter(v => v !== value);
            
            return {
                ...prev,
                [field]: newValues.length > 0 ? newValues : undefined
            };
        });
    };

    // Handle age range changes
    const handleAgeRangeChange = (values: number[]) => {
        setLocalFilters(prev => ({
            ...prev,
            ageRange: {
                min: values[0],
                max: values[1]
            }
        }));
    };

    const FilterSection = ({ 
        title, 
        field, 
        options 
    }: { 
        title: string; 
        field: keyof typeof expandedSections; 
        options: string[] 
    }) => (
        <Collapsible
            open={expandedSections[field]}
            onOpenChange={() => toggleSection(field)}
        >
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <span className="font-medium">{title}</span>
                    {expandedSections[field] ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
                {options.map((option) => {
                    const fieldValue = localFilters[field as keyof ActorFiltersType];
                    const isChecked = Array.isArray(fieldValue) ? fieldValue.includes(option) : false;
                    return (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${field}-${option}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => 
                                    handleMultiSelectChange(
                                        field as 'gender' | 'ethnicAppearance' | 'height' | 'unionStatus' | 'tags',
                                        option,
                                        checked as boolean
                                    )
                                }
                            />
                            <Label 
                                htmlFor={`${field}-${option}`}
                                className="text-sm cursor-pointer"
                            >
                                {option}
                            </Label>
                        </div>
                    );
                })}
            </CollapsibleContent>
        </Collapsible>
    );

    return (
        <Card className="h-full rounded-none border-0 border-r">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Filters</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Gender Filter */}
                <div>
                    <FilterSection
                        title="Gender"
                        field="gender"
                        options={filterOptions.genders}
                    />
                </div>

                {/* Age Range Filter */}
                <div>
                    <Collapsible
                        open={expandedSections.age}
                        onOpenChange={() => toggleSection('age')}
                    >
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                                <span className="font-medium">Age Range</span>
                                {expandedSections.age ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 mt-2">
                            <div className="px-2">
                                <Slider
                                    value={[
                                        localFilters.ageRange?.min || 18,
                                        localFilters.ageRange?.max || 80
                                    ]}
                                    onValueChange={handleAgeRangeChange}
                                    min={18}
                                    max={80}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>{localFilters.ageRange?.min || 18}</span>
                                    <span>{localFilters.ageRange?.max || 80}</span>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                                                {/* Ethnic Appearance Filter */}
                                <div>
                                    <FilterSection
                                        title="Ethnic Appearance"
                                        field="ethnicAppearance"
                                        options={filterOptions.ethnicAppearances}
                                    />
                                </div>

                {/* Height Filter */}
                <div>
                    <FilterSection
                        title="Height"
                        field="height"
                        options={filterOptions.heights}
                    />
                </div>

                {/* Union Status Filter */}
                <div>
                    <FilterSection
                        title="Union Status"
                        field="unionStatus"
                        options={filterOptions.unionStatuses}
                    />
                </div>

                {/* Tags Filter */}
                <div>
                    <FilterSection
                        title="Tags"
                        field="tags"
                        options={filterOptions.tags}
                    />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                    <Button onClick={applyFilters} className="w-full">
                        Apply Filters
                    </Button>
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                        Clear All
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}