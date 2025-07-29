// Actors slice for Zustand store

import type { StateCreator } from 'zustand';
import type { 
    Actor, 
    CreateActorInput, 
    UpdateActorInput, 
    ActorFilters 
} from '../../types';
import { 
    createActor, 
    updateEntity, 
    filterActors, 
    extractUniqueTags, 
    extractUniqueValues 
} from '../../utils/typeHelpers';

export interface ActorsSlice {
    actors: Actor[];
    
    // Actions
    addActor: (input: CreateActorInput) => Actor;
    updateActor: (id: string, updates: UpdateActorInput) => void;
    deleteActor: (id: string) => void;
    searchActors: (filters: ActorFilters) => Actor[];
    getFilterOptions: () => {
        genders: string[];
        races: string[];
        heights: string[];
        representations: string[];
        tags: string[];
    };
}

export const createActorsSlice: StateCreator<
    ActorsSlice,
    [],
    [],
    ActorsSlice
> = (set, get) => ({
    actors: [],

    addActor: (input: CreateActorInput) => {
        const newActor = createActor(input);
        set(state => ({
            actors: [...state.actors, newActor]
        }));
        return newActor;
    },

    updateActor: (id: string, updates: UpdateActorInput) => {
        set(state => ({
            actors: state.actors.map(actor =>
                actor.id === id ? updateEntity(actor, updates) : actor
            )
        }));
    },

    deleteActor: (id: string) => {
        set(state => ({
            actors: state.actors.filter(actor => actor.id !== id)
        }));
    },

    searchActors: (filters: ActorFilters) => {
        const { actors } = get();
        return filterActors(actors, filters);
    },

    getFilterOptions: () => {
        const { actors } = get();
        return {
            genders: extractUniqueValues(actors, 'gender'),
            races: extractUniqueValues(actors, 'race'),
            heights: extractUniqueValues(actors, 'height'),
            representations: extractUniqueValues(actors, 'representation'),
            tags: extractUniqueTags(actors),
        };
    },
});