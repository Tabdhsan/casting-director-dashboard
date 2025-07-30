// Actor Database page component

import { useState, useEffect } from 'react';
import { Grid, Table, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActors, useUI } from '@/hooks/useStore';
import { ActorGrid } from '@/components/actors/ActorGrid';
import { ActorTable } from '@/components/actors/ActorTable';
import { ActorFilters } from '@/components/actors/ActorFilters';
import { AddActorModal } from '@/components/actors/AddActorModal';
import { ActorModal } from '@/components/actors/ActorModal';
import { EditActorModal } from '@/components/actors/EditActorModal';
import { DeleteActorModal } from '@/components/actors/DeleteActorModal';
import { loadMockActors } from '@/mockData/actors';
import { cn } from '@/lib/utils';
import type { Actor } from '@/types';

export function ActorDatabase() {
    const { actors, addActor } = useActors();
    const { ui, setCurrentView, setActiveFilters } = useUI();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewActor, setViewActor] = useState<Actor | null>(null);
    const [editActor, setEditActor] = useState<Actor | null>(null);
    const [deleteActor, setDeleteActor] = useState<Actor | null>(null);

    // Load mock data if no actors exist (for demo purposes)
    useEffect(() => {
        if (actors.length === 0) {
            loadMockActors(addActor);
        }
    }, [actors.length, addActor]);

    // Handle search with debouncing
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Update filters to include search query
        const newFilters = {
            ...ui.activeFilters,
            search: query || undefined
        };
        setActiveFilters(newFilters);
    };

    // Handle view toggle
    const handleViewToggle = (view: 'grid' | 'table') => {
        setCurrentView(view);
    };

    // Handle filter changes
    const handleFiltersChange = (filters: any) => {
        setActiveFilters(filters);
    };

    return (
        <div className="flex h-full">
            {/* Filters Sidebar */}
            <div className={cn(
                "transition-all duration-300 border-r bg-background",
                showFilters ? "w-80" : "w-0 overflow-hidden"
            )}>
                {showFilters && (
                    <ActorFilters
                        filters={ui.activeFilters}
                        onFiltersChange={handleFiltersChange}
                        onClose={() => setShowFilters(false)}
                    />
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="border-b bg-background p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Actor Database</h1>
                            <p className="text-muted-foreground">
                                Browse and manage your actor database ({actors.length} actors)
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Add Actor Button */}
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Actor
                            </Button>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search actors..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>

                            {/* Filter Toggle */}
                            <Button
                                variant={showFilters ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>

                            {/* View Toggle */}
                            <div className="flex items-center space-x-1 rounded-lg border p-1">
                                <Button
                                    variant={ui.currentView === 'grid' ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => handleViewToggle('grid')}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={ui.currentView === 'table' ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => handleViewToggle('table')}
                                >
                                    <Table className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    {ui.currentView === 'grid' ? (
                        <ActorGrid 
                            actors={actors}
                            filters={ui.activeFilters}
                            onEdit={setEditActor}
                            onDelete={setDeleteActor}
                        />
                    ) : (
                        <ActorTable 
                            actors={actors}
                            filters={ui.activeFilters}
                            onEdit={setEditActor}
                            onDelete={setDeleteActor}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddActorModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
            />
            
            <ActorModal
                actor={viewActor}
                open={!!viewActor}
                onClose={() => setViewActor(null)}
                onEdit={(actor) => {
                    setViewActor(null);
                    setEditActor(actor);
                }}
            />
            
            <EditActorModal
                actor={editActor}
                open={!!editActor}
                onClose={() => setEditActor(null)}
            />
            
            <DeleteActorModal
                actor={deleteActor}
                open={!!deleteActor}
                onClose={() => setDeleteActor(null)}
                onDeleted={() => setDeleteActor(null)}
            />
        </div>
    );
}