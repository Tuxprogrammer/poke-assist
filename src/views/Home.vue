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

        <!-- Type Charts Button -->
        <div class="type-charts-container">
            <router-link to="/type-charts" class="type-charts-button">
                📊 Type Charts
            </router-link>
        </div>

        <div v-if="searchQuery && filteredPokemon.length === 0" class="pokemon-info">
            <div class="loading">No Pokémon found matching "{{ searchQuery }}"</div>
        </div>

        <!-- Search History Section -->
        <div v-if="searchHistory.length > 0" class="search-history-container">
            <h3 class="history-title">Recent</h3>
            <div class="history-grid">
                <div v-for="historyItem in searchHistory" :key="historyItem.pokemon.id" class="history-item"
                    @click="selectHistoryPokemon(historyItem)">
                    <div class="history-pokemon-name">{{ getPokemonDisplayName(historyItem.pokemon) }}</div>
                    <div class="history-pokemon-generation">{{ historyItem.generation }}</div>
                    <div class="history-pokemon-types">
                        <span
                            v-for="type in getPokemonTypes(historyItem.pokemon, getGenerationNumber(historyItem.generation))"
                            :key="type" :style="{ backgroundColor: getTypeColor(type) }" class="history-type-badge">
                            {{ type }}
                        </span>
                    </div>
                </div>
            </div>
            <button @click="clearHistory" class="clear-history-button">
                Clear History
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, type Ref, type ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import { getPokemonDisplayName, getPokemonTypes, typeColors, type Pokemon, type PokemonType, type Generation } from '../pokemonData';
import { pokemonList } from '../pokemonList';

const SEARCH_HISTORY_KEY = 'poke-assist-search-history';
const MAX_HISTORY_ITEMS = 9; export default {
    name: 'Home',
    setup() {
        const router = useRouter();
        const searchQuery: Ref<string> = ref('');
        const showSuggestions: Ref<boolean> = ref(false);
        const highlightedIndex: Ref<number> = ref(-1);
        const searchInput: Ref<HTMLInputElement | null> = ref(null);

        // Define the history item type to include generation
        type HistoryItem = {
            pokemon: Pokemon;
            generation: string;
        };

        const searchHistory: Ref<HistoryItem[]> = ref([]);

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

            const defaultGeneration = '9';
            // Add to search history with default generation
            addToHistory(pokemon, defaultGeneration);

            // Navigate to the Pokemon route
            router.push({
                name: 'Pokemon',
                params: {
                    id: pokemon.id.toString(),
                    generation: defaultGeneration
                }
            });

            searchInput.value?.blur();
        }

        function selectHistoryPokemon(historyItem: HistoryItem): void {
            // Navigate to the Pokemon route with the stored generation
            router.push({
                name: 'Pokemon',
                params: {
                    id: historyItem.pokemon.id.toString(),
                    generation: getGenerationNumber(historyItem.generation).toString()
                }
            });
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
            const generations: string[] = [];
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
                generations.push(gen.toString());
            }

            // Add Orre region if Pokémon existed in Gen 3 or earlier
            if (firstGeneration <= 3) {
                const gen3Index = generations.indexOf('3');
                if (gen3Index !== -1) {
                    generations.splice(gen3Index + 1, 0, 'orre');
                }
            }

            // Randomly pick one of the available generations
            const randomGenIndex = Math.floor(Math.random() * generations.length);
            const randomGeneration = generations[randomGenIndex];

            // Add to search history with the random generation
            addToHistory(randomPokemon, randomGeneration);

            // Navigate to the Pokemon route with random generation
            router.push({
                name: 'Pokemon',
                params: {
                    id: randomPokemon.id.toString(),
                    generation: randomGeneration
                }
            });

            searchInput.value?.blur();
        }

        // Search History Management
        function loadSearchHistory(): void {
            try {
                const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
                if (stored) {
                    const historyData = JSON.parse(stored) as Array<{ id: number, generation: string }>;
                    searchHistory.value = historyData
                        .map(item => {
                            const pokemon = pokemonList.find(p => p.id === item.id);
                            return pokemon ? { pokemon, generation: item.generation } : null;
                        })
                        .filter((item): item is HistoryItem => item !== null);
                }
            } catch (error) {
                console.warn('Failed to load search history:', error);
                searchHistory.value = [];
            }
        }

        function saveSearchHistory(): void {
            try {
                const historyData = searchHistory.value.map(item => ({
                    id: item.pokemon.id,
                    generation: item.generation
                }));
                localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(historyData));
            } catch (error) {
                console.warn('Failed to save search history:', error);
            }
        }

        function addToHistory(pokemon: Pokemon, generation: string = '9'): void {
            // Remove if already exists to avoid duplicates
            searchHistory.value = searchHistory.value.filter(item => item.pokemon.id !== pokemon.id);

            // Add to the beginning
            searchHistory.value.unshift({ pokemon, generation });

            // Keep only the last MAX_HISTORY_ITEMS
            if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
                searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_ITEMS);
            }

            saveSearchHistory();
        }

        function clearHistory(): void {
            searchHistory.value = [];
            try {
                localStorage.removeItem(SEARCH_HISTORY_KEY);
            } catch (error) {
                console.warn('Failed to clear search history:', error);
            }
        }

        function getTypeColor(type: PokemonType): string {
            return typeColors[type] || '#68A090';
        }

        function getGenerationNumber(generationLabel: string): Generation {
            const labelToNumber: Record<string, Generation> = {
                'RBGY': 1,
                'GSC': 2,
                'RSE': 3,
                'CoXD': 'orre',
                'DPPt': 4,
                'BW': 5,
                'XY': 6,
                'SM': 7,
                'SwSh': 8,
                'SV': 9,
            };
            return labelToNumber[generationLabel] || 9;
        }

        function getGenerationLabel(generationNumber: number | string): string {
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
            return generationLabels[generationNumber.toString()] || 'SV';
        }

        // Load search history on component mount
        onMounted(() => {
            loadSearchHistory();
        });

        return {
            searchQuery,
            showSuggestions,
            highlightedIndex,
            searchInput,
            searchHistory,
            filteredPokemon,
            onSearchInput,
            onKeyDown,
            selectPokemon,
            selectHistoryPokemon,
            selectRandomPokemon,
            onBlur,
            clearHistory,
            getPokemonDisplayName,
            getPokemonTypes,
            getTypeColor,
            getGenerationNumber,
            getGenerationLabel,
        };
    },
};
</script>