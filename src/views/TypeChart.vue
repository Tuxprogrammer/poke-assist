<template>
    <div>
        <div class="navigation">
            <div class="back-button-container">
                <router-link to="/" class="back-button">← Back to Search</router-link>
            </div>
        </div>

        <div class="pokemon-info">
            <h2 class="pokemon-name">Type Effectiveness Chart</h2>

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

            <div class="type-chart-container">
                <div class="type-chart-wrapper">
                    <table class="type-chart">
                        <thead>
                            <tr>
                                <th class="corner-cell">
                                    <div class="corner-labels">
                                        <span class="defending-label">Defending →</span>
                                        <span class="attacking-label">↓ Attacking</span>
                                    </div>
                                </th>
                                <th v-for="defendingType in availableTypes" :key="`def-${defendingType}`"
                                    class="type-header defending-type"
                                    :style="{ backgroundColor: getTypeColor(defendingType) }">
                                    {{ defendingType.charAt(0).toUpperCase() + defendingType.slice(1) }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="attackingType in availableTypes" :key="`att-${attackingType}`">
                                <td class="type-header attacking-type"
                                    :style="{ backgroundColor: getTypeColor(attackingType) }">
                                    {{ attackingType.charAt(0).toUpperCase() + attackingType.slice(1) }}
                                </td>
                                <td v-for="defendingType in availableTypes" :key="`${attackingType}-${defendingType}`"
                                    class="effectiveness-cell"
                                    :class="getEffectivenessClass(attackingType, defendingType)">
                                    {{ getEffectivenessSymbol(attackingType, defendingType) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="chart-legend">
                    <div class="legend-item">
                        <span class="legend-symbol no-effect">✕</span>
                        <span class="legend-text">No Effect (0×)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-symbol not-very-effective">△</span>
                        <span class="legend-text">Not Very Effective (0.5×)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-symbol normal-effective">-</span>
                        <span class="legend-text">Normal (1×)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-symbol super-effective">○</span>
                        <span class="legend-text">Super Effective (2×)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    type PokemonType,
    type Generation,
    typeColors,
    getTypeEffectiveness
} from '../pokemonData';

const selectedGeneration = ref<Generation>(9);

// Available generations for the selector
const availableGenerations = computed(() => {
    const gens: Generation[] = [1, 2, 3, 'orre', 4, 5, 6, 7, 8, 9];
    return gens;
});

// Generation labels mapping
const generationLabels: Record<Generation, string> = {
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

// Get available types for the selected generation
const availableTypes = computed((): PokemonType[] => {
    const baseTypes: PokemonType[] = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon'
    ];

    const types: PokemonType[] = [...baseTypes];

    // Dark and Steel types added in Generation 2
    if (typeof selectedGeneration.value === 'number' && selectedGeneration.value >= 2) {
        types.push('dark', 'steel');
    }

    // Orre region includes Shadow type
    if (selectedGeneration.value === 'orre') {
        types.push('dark', 'steel', 'shadow');
    }

    // Fairy type added in Generation 6
    if (typeof selectedGeneration.value === 'number' && selectedGeneration.value >= 6) {
        types.push('fairy');
    }

    return types;
});

function getTypeColor(type: PokemonType): string {
    return typeColors[type] || '#68A090';
}

function updateGeneration(generation: Generation): void {
    selectedGeneration.value = generation;
}

function getEffectivenessSymbol(attackingType: PokemonType, defendingType: PokemonType): string {
    const effectiveness = getTypeEffectiveness(attackingType, [defendingType], selectedGeneration.value);

    switch (effectiveness) {
        case 0: return '✕';      // No effect
        case 0.5: return '△';    // Not very effective
        case 2: return '○';      // Super effective
        default: return '-';      // Normal effectiveness
    }
}

function getEffectivenessClass(attackingType: PokemonType, defendingType: PokemonType): string {
    const effectiveness = getTypeEffectiveness(attackingType, [defendingType], selectedGeneration.value);

    switch (effectiveness) {
        case 0: return 'no-effect';
        case 0.5: return 'not-very-effective';
        case 2: return 'super-effective';
        default: return 'normal-effective';
    }
}

onMounted(() => {
    // Component mounted, ready to display
});
</script>