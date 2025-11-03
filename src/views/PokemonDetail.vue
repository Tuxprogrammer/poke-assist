<template>
    <div>
        <div class="search-container">
            <div class="search-box">
                <input ref="searchInput" v-model="searchQuery" @input="onSearchInput" @keydown="onKeyDown"
                    @focus="showSuggestions = true" @blur="onBlur" class="search-input" type="text"
                    placeholder="Enter a Pokémon name..." autocomplete="off" />
                <button @click="selectRandomPokemon" class="random-button" title="Pick a random Pokémon">
                    🎲
                </button>

                <div v-if="showSuggestions && filteredPokemon.length > 0" class="suggestions">
                    <div v-for="(pokemon, index) in filteredPokemon.slice(0, 10)" :key="pokemon.id"
                        :class="['suggestion-item', { highlighted: index === highlightedIndex }]"
                        @mousedown="selectPokemon(pokemon)" @mouseenter="highlightedIndex = index">
                        {{ getPokemonDisplayName(pokemon) }}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedPokemon" class="pokemon-info">
            <h2 class="pokemon-name">{{ getPokemonDisplayName(selectedPokemon) }}</h2>

            <div class="generation-selector">
                <div class="generation-label">Generation:</div>
                <div class="generation-buttons">
                    <button v-for="gen in availableGenerations" :key="gen"
                        :class="['generation-btn', `gen-${gen}`, { active: selectedGeneration === gen }]"
                        @click="updateGeneration(gen)">
                        {{ generationLabels[gen] }}
                    </button>
                </div>
            </div>

            <div class="types-container">
                <div class="effectiveness-title">Type(s) in Generation {{ selectedGeneration }}:</div>
                <div class="effectiveness-types">
                    <span v-for="type in currentPokemonTypes" :key="type"
                        :style="{ backgroundColor: getTypeColor(type) }" class="type-badge">
                        {{ type }}
                    </span>
                </div>
            </div>

            <div class="effectiveness-section" v-if="effectiveness?.superEffective.length ?? 0 > 0">
                <div class="effectiveness-title">Super Effective Against {{ getPokemonDisplayName(selectedPokemon) }}
                    (2x+
                    damage):</div>
                <div class="effectiveness-types">
                    <span v-for="type in effectiveness?.superEffective" :key="type"
                        :style="{ backgroundColor: getTypeColor(type) }" class="type-badge">
                        {{ type }}
                    </span>
                </div>
            </div>

            <div class="effectiveness-section" v-if="effectiveness?.normal.length ?? 0 > 0">
                <div class="effectiveness-title">Normal Effectiveness Against {{ getPokemonDisplayName(selectedPokemon)
                }} (1x
                    damage):</div>
                <div class="effectiveness-types">
                    <span v-for="type in effectiveness?.normal" :key="type"
                        :style="{ backgroundColor: getTypeColor(type) }" class="type-badge">
                        {{ type }}
                    </span>
                </div>
            </div>

            <div class="effectiveness-section" v-if="effectiveness?.notVeryEffective.length ?? 0 > 0">
                <div class="effectiveness-title">Not Very Effective Against {{ getPokemonDisplayName(selectedPokemon) }}
                    (0.5x
                    damage):</div>
                <div class="effectiveness-types">
                    <span v-for="type in effectiveness?.notVeryEffective" :key="type"
                        :style="{ backgroundColor: getTypeColor(type) }" class="type-badge">
                        {{ type }}
                    </span>
                </div>
            </div>

            <div class="effectiveness-section" v-if="effectiveness?.noEffect.length ?? 0 > 0">
                <div class="effectiveness-title">No Effect Against {{ getPokemonDisplayName(selectedPokemon) }} (0x
                    damage):
                </div>
                <div class="effectiveness-types">
                    <span v-for="type in effectiveness?.noEffect" :key="type"
                        :style="{ backgroundColor: getTypeColor(type) }" class="type-badge">
                        {{ type }}
                    </span>
                </div>
            </div>

            <div class="back-button-container">
                <button @click="goBackToSearch" class="back-button red-back-button">
                    ← Back
                </button>
            </div>
        </div>

        <div v-else class="pokemon-info">
            <div class="loading">Pokémon not found</div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch, nextTick, type Ref, type ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    typeColors,
    categorizeEffectiveness,
    getPokemonTypes,
    getPokemonDisplayName,
    type Pokemon,
    type PokemonType,
    type Generation,
    type EffectivenessCategories
} from '../pokemonData';
import { pokemonList } from '../pokemonList';

const SEARCH_HISTORY_KEY = 'poke-assist-search-history';
const MAX_HISTORY_ITEMS = 9;

type GenerationLabel = Record<Generation, string>;

export default {
    name: 'PokemonDetail',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const selectedPokemon: Ref<Pokemon | null> = ref(null);
        const selectedGeneration: Ref<Generation> = ref(9);
        const searchQuery: Ref<string> = ref('');
        const showSuggestions: Ref<boolean> = ref(false);
        const highlightedIndex: Ref<number> = ref(-1);
        const searchInput: Ref<HTMLInputElement | null> = ref(null);

        const generationLabels: GenerationLabel = {
            1: 'RBGY',
            2: 'GSC',
            3: 'RSE',
            'orre': 'CoXD',
            4: 'DPPt',
            5: 'BW',
            6: 'XY',
            7: 'SM',
            8: 'SwSh',
            9: 'SV',
        };

        const effectiveness: ComputedRef<EffectivenessCategories | null> = computed(() => {
            if (!selectedPokemon.value) return null;
            const pokemonTypes: PokemonType[] = getPokemonTypes(selectedPokemon.value, selectedGeneration.value);
            return categorizeEffectiveness(pokemonTypes, selectedGeneration.value);
        });

        const currentPokemonTypes: ComputedRef<PokemonType[]> = computed(() => {
            if (!selectedPokemon.value) return [];
            return getPokemonTypes(selectedPokemon.value, selectedGeneration.value);
        });

        const availableGenerations: ComputedRef<Generation[]> = computed(() => {
            if (!selectedPokemon.value) return [1, 2, 3, 'orre', 4, 5, 6, 7, 8, 9];

            const pokemon = selectedPokemon.value;

            // Handle special forms with restricted generation availability

            // Shadow forms (Colosseum/XD exclusive)
            if (pokemon.form === 'Shadow') {
                return ['orre'];
            }

            // Regional variants
            if (pokemon.region === 'Hisui') {
                return [8, 9]; // Legends: Arceus (Gen 8) onwards
            }
            if (pokemon.region === 'Galar') {
                return [8, 9]; // Sword/Shield onwards
            }
            if (pokemon.region === 'Alola') {
                return [7, 8, 9]; // Sun/Moon onwards
            }
            if (pokemon.region === 'Paldea') {
                return [9]; // Scarlet/Violet only
            }

            // Special battle forms
            if (pokemon.form?.startsWith('Mega Evolution') || pokemon.form === 'Primal Reversion') {
                return [6]; // Generation 6 only (X/Y, Omega Ruby/Alpha Sapphire)
            }
            if (pokemon.form === 'Ash-Greninja') {
                return [6, 9]; // Generation 6 and 9 only
            }
            if (['Crowned Sword', 'Crowned Shield', 'Rapid Strike Style'].includes(pokemon.form || '')) {
                return [8, 9]; // Generation 8 onwards
            }

            // For regular forms, use the original logic
            const generations: Generation[] = [];

            // Determine the first generation this Pokémon appeared in based on ID
            let firstGeneration: number = 1;
            if (pokemon.id >= 152 && pokemon.id <= 251) firstGeneration = 2;
            else if (pokemon.id >= 252 && pokemon.id <= 386) firstGeneration = 3;
            else if (pokemon.id >= 387 && pokemon.id <= 493) firstGeneration = 4;
            else if (pokemon.id >= 494 && pokemon.id <= 649) firstGeneration = 5;
            else if (pokemon.id >= 650 && pokemon.id <= 721) firstGeneration = 6;
            else if (pokemon.id >= 722 && pokemon.id <= 809) firstGeneration = 7;
            else if (pokemon.id >= 810 && pokemon.id <= 898) firstGeneration = 8;
            else if (pokemon.id >= 906 && pokemon.id <= 1025) firstGeneration = 9;

            // Add all generations from first appearance onwards
            for (let gen = firstGeneration; gen <= 9; gen++) {
                generations.push(gen as Generation);
            }

            // Add Orre region if Pokémon existed in Gen 3 or earlier (Colosseum/XD only had Gen 1-3 Pokémon)
            if (firstGeneration <= 3) {
                // Insert Orre after Gen 3
                const gen3Index = generations.indexOf(3);
                if (gen3Index !== -1) {
                    generations.splice(gen3Index + 1, 0, 'orre');
                }
            }

            return generations;
        });

        const filteredPokemon: ComputedRef<Pokemon[]> = computed(() => {
            if (!searchQuery.value) return [];

            const query = searchQuery.value.toLowerCase().trim();
            return pokemonList.filter((pokemon: Pokemon) =>
                pokemon.name.toLowerCase().includes(query)
            ).sort((a: Pokemon, b: Pokemon) => {
                // Prioritize exact matches and matches at the beginning
                const aStartsWith = a.name.toLowerCase().startsWith(query);
                const bStartsWith = b.name.toLowerCase().startsWith(query);

                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;

                return a.name.localeCompare(b.name);
            });
        });

        function loadPokemon(): void {
            const pokemonId = parseFloat(route.params.id as string);
            if (pokemonId) {
                selectedPokemon.value = pokemonList.find(p => p.id === pokemonId) || null;

                // Update search query to match the current Pokemon and add to history
                if (selectedPokemon.value) {
                    searchQuery.value = selectedPokemon.value.name;
                    // Add to search history when loading directly
                    addToHistory(selectedPokemon.value);
                }

                // Set generation from route params or default to available generation
                const routeGeneration = route.params.generation as string;
                if (routeGeneration && selectedPokemon.value) {
                    const gen = routeGeneration === 'orre' ? 'orre' : parseInt(routeGeneration) as Generation;
                    nextTick(() => {
                        const available = availableGenerations.value;
                        if (available.includes(gen)) {
                            selectedGeneration.value = gen;
                        } else {
                            selectedGeneration.value = available[0];
                            // Update URL with correct generation
                            router.replace({
                                name: 'Pokemon',
                                params: {
                                    id: pokemonId.toString(),
                                    generation: available[0].toString()
                                }
                            });
                        }
                    });
                } else if (selectedPokemon.value) {
                    nextTick(() => {
                        selectedGeneration.value = availableGenerations.value[0];
                    });
                }
            }
        }

        function updateGeneration(gen: Generation): void {
            selectedGeneration.value = gen;
            // Update the URL to reflect the new generation
            router.push({
                name: 'Pokemon',
                params: {
                    id: route.params.id as string,
                    generation: gen.toString()
                }
            });
        }

        function onSearchInput(): void {
            showSuggestions.value = true;
            highlightedIndex.value = -1;
        }

        function onKeyDown(event: KeyboardEvent): void {
            if (!showSuggestions.value || filteredPokemon.value.length === 0) return;

            const maxIndex = Math.min(filteredPokemon.value.length - 1, 9); // Max 10 suggestions

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    highlightedIndex.value = highlightedIndex.value < maxIndex ? highlightedIndex.value + 1 : 0;
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    highlightedIndex.value = highlightedIndex.value > 0 ? highlightedIndex.value - 1 : maxIndex;
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (highlightedIndex.value >= 0) {
                        selectPokemon(filteredPokemon.value[highlightedIndex.value]);
                    } else if (filteredPokemon.value.length > 0) {
                        selectPokemon(filteredPokemon.value[0]);
                    }
                    break;
                case 'Escape':
                    showSuggestions.value = false;
                    highlightedIndex.value = -1;
                    searchInput.value?.blur();
                    break;
            }
        }

        function selectPokemon(pokemon: Pokemon): void {
            showSuggestions.value = false;
            highlightedIndex.value = -1;
            searchQuery.value = pokemon.name;

            // Add to search history
            addToHistory(pokemon);

            // Navigate to the new Pokemon
            router.push({
                name: 'Pokemon',
                params: {
                    id: pokemon.id.toString(),
                    generation: selectedGeneration.value.toString()
                }
            });

            searchInput.value?.blur();
        }

        function onBlur(): void {
            // Delay hiding suggestions to allow click events on suggestions
            setTimeout(() => {
                showSuggestions.value = false;
                highlightedIndex.value = -1;
            }, 150);
        }

        function selectRandomPokemon(): void {
            if (pokemonList.length === 0) return;

            const randomIndex = Math.floor(Math.random() * pokemonList.length);
            const randomPokemon = pokemonList[randomIndex];

            // Calculate available generations for this Pokemon
            const generations: Generation[] = [];
            let firstGeneration: number = 1;
            if (randomPokemon.id >= 152 && randomPokemon.id <= 251) firstGeneration = 2;
            else if (randomPokemon.id >= 252 && randomPokemon.id <= 386) firstGeneration = 3;
            else if (randomPokemon.id >= 387 && randomPokemon.id <= 493) firstGeneration = 4;
            else if (randomPokemon.id >= 494 && randomPokemon.id <= 649) firstGeneration = 5;
            else if (randomPokemon.id >= 650 && randomPokemon.id <= 721) firstGeneration = 6;
            else if (randomPokemon.id >= 722 && randomPokemon.id <= 809) firstGeneration = 7;
            else if (randomPokemon.id >= 810 && randomPokemon.id <= 898) firstGeneration = 8;
            else if (randomPokemon.id >= 906 && randomPokemon.id <= 1025) firstGeneration = 9;

            // Add all generations from first appearance onwards
            for (let gen = firstGeneration; gen <= 9; gen++) {
                generations.push(gen as Generation);
            }

            // Add Orre region if Pokémon existed in Gen 3 or earlier
            if (firstGeneration <= 3) {
                const gen3Index = generations.indexOf(3);
                if (gen3Index !== -1) {
                    generations.splice(gen3Index + 1, 0, 'orre');
                }
            }

            // Randomly pick one of the available generations
            const randomGenIndex = Math.floor(Math.random() * generations.length);
            const randomGeneration = generations[randomGenIndex];

            // Navigate directly with the random Pokemon and generation
            router.push({
                name: 'Pokemon',
                params: {
                    id: randomPokemon.id.toString(),
                    generation: randomGeneration.toString()
                }
            });

            searchInput.value?.blur();
        }

        function goBackToSearch(): void {
            // Clear the search box
            searchQuery.value = '';
            // Navigate back to the home page
            router.push({ name: 'Home' });
        }

        function getTypeColor(type: PokemonType): string {
            return typeColors[type] || '#68A090';
        }

        // Search History Management
        function addToHistory(pokemon: Pokemon): void {
            try {
                const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
                let history: Array<{ id: number, generation: string }> = [];

                if (stored) {
                    history = JSON.parse(stored) as Array<{ id: number, generation: string }>;
                }

                // Get the generation label for current generation
                const generationLabels: Record<string, string> = {
                    '1': 'RBGY',
                    '2': 'GSC',
                    '3': 'RSE',
                    'orre': 'CoXD',
                    '4': 'DPPt',
                    '5': 'BW',
                    '6': 'XY',
                    '7': 'SM',
                    '8': 'SwSh',
                    '9': 'SV',
                };

                const currentGenerationLabel = generationLabels[selectedGeneration.value.toString()] || 'SV';

                // Remove if already exists to avoid duplicates
                history = history.filter(item => item.id !== pokemon.id);

                // Add to the beginning with current generation
                history.unshift({ id: pokemon.id, generation: currentGenerationLabel });

                // Keep only the last MAX_HISTORY_ITEMS
                if (history.length > MAX_HISTORY_ITEMS) {
                    history = history.slice(0, MAX_HISTORY_ITEMS);
                }

                localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
            } catch (error) {
                console.warn('Failed to save to search history:', error);
            }
        }

        // Watch for route changes to load the correct Pokemon
        watch(() => route.params, loadPokemon, { immediate: true });

        return {
            selectedPokemon,
            selectedGeneration,
            searchQuery,
            showSuggestions,
            highlightedIndex,
            searchInput,
            filteredPokemon,
            effectiveness,
            currentPokemonTypes,
            availableGenerations,
            updateGeneration,
            onSearchInput,
            onKeyDown,
            selectPokemon,
            onBlur,
            selectRandomPokemon,
            goBackToSearch,
            getTypeColor,
            getPokemonDisplayName,
            generationLabels,
        };
    },
};
</script>