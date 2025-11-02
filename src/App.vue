<template>
  <div class="container">
    <header class="header">
      <h1>Poke-Assist</h1>
      <p>Type Effectiveness Lookup</p>
    </header>

    <div class="search-container">
      <div class="search-box">
        <input
          ref="searchInput"
          v-model="searchQuery"
          @input="onSearchInput"
          @keydown="onKeyDown"
          @focus="showSuggestions = true"
          @blur="onBlur"
          class="search-input"
          type="text"
          placeholder="Enter a Pokémon name..."
          autocomplete="off"
        />
        
        <div v-if="showSuggestions && filteredPokemon.length > 0" class="suggestions">
          <div
            v-for="(pokemon, index) in filteredPokemon.slice(0, 10)"
            :key="pokemon.id"
            :class="['suggestion-item', { highlighted: index === highlightedIndex }]"
            @mousedown="selectPokemon(pokemon)"
            @mouseenter="highlightedIndex = index"
          >
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
          <button
            v-for="gen in availableGenerations"
            :key="gen"
            :class="['generation-btn', `gen-${gen}`, { active: selectedGeneration === gen }]"
            @click="selectedGeneration = gen"
          >
            {{ generationLabels[gen] }}
          </button>
        </div>
      </div>
      
      <div class="types-container">
        <div class="effectiveness-title">Type(s) in Generation {{ selectedGeneration }}:</div>
        <div class="effectiveness-types">
          <span
            v-for="type in currentPokemonTypes"
            :key="type"
            :style="{ backgroundColor: getTypeColor(type) }"
            class="type-badge"
          >
            {{ type }}
          </span>
        </div>
      </div>

      <div class="effectiveness-section" v-if="effectiveness.superEffective.length > 0">
        <div class="effectiveness-title">Super Effective Against {{ getPokemonDisplayName(selectedPokemon) }} (2x+ damage):</div>
        <div class="effectiveness-types">
          <span
            v-for="type in effectiveness.superEffective"
            :key="type"
            :style="{ backgroundColor: getTypeColor(type) }"
            class="type-badge"
          >
            {{ type }}
          </span>
        </div>
      </div>

      <div class="effectiveness-section" v-if="effectiveness.normal.length > 0">
        <div class="effectiveness-title">Normal Effectiveness Against {{ getPokemonDisplayName(selectedPokemon) }} (1x damage):</div>
        <div class="effectiveness-types">
          <span
            v-for="type in effectiveness.normal"
            :key="type"
            :style="{ backgroundColor: getTypeColor(type) }"
            class="type-badge"
          >
            {{ type }}
          </span>
        </div>
      </div>

      <div class="effectiveness-section" v-if="effectiveness.notVeryEffective.length > 0">
        <div class="effectiveness-title">Not Very Effective Against {{ getPokemonDisplayName(selectedPokemon) }} (0.5x damage):</div>
        <div class="effectiveness-types">
          <span
            v-for="type in effectiveness.notVeryEffective"
            :key="type"
            :style="{ backgroundColor: getTypeColor(type) }"
            class="type-badge"
          >
            {{ type }}
          </span>
        </div>
      </div>

      <div class="effectiveness-section" v-if="effectiveness.noEffect.length > 0">
        <div class="effectiveness-title">No Effect Against {{ getPokemonDisplayName(selectedPokemon) }} (0x damage):</div>
        <div class="effectiveness-types">
          <span
            v-for="type in effectiveness.noEffect"
            :key="type"
            :style="{ backgroundColor: getTypeColor(type) }"
            class="type-badge"
          >
            {{ type }}
          </span>
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && filteredPokemon.length === 0" class="pokemon-info">
      <div class="loading">No Pokémon found matching "{{ searchQuery }}"</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'
import { typeColors, categorizeEffectiveness, getPokemonTypes, getPokemonDisplayName } from './pokemon/pokemonData'
import { pokemonList } from './pokemonList'

export default {
  name: 'PokemonApp',
  setup() {
    const searchQuery = ref('')
    const selectedPokemon = ref(null)
    const showSuggestions = ref(false)
    const highlightedIndex = ref(-1)
    const searchInput = ref(null)
    const selectedGeneration = ref(9)

    const generationLabels = {
      1: 'RBGY',
      2: 'GSC',
      3: 'RSE',
      'orre': 'CoXD',
      4: 'DPPt',
      5: 'BW',
      6: 'XY',
      7: 'SM',
      8: 'SwSh',
      9: 'SV'
    }

    const filteredPokemon = computed(() => {
      if (!searchQuery.value) return []
      
      const query = searchQuery.value.toLowerCase().trim()
      return pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query)
      ).sort((a, b) => {
        // Prioritize exact matches and matches at the beginning
        const aStartsWith = a.name.toLowerCase().startsWith(query)
        const bStartsWith = b.name.toLowerCase().startsWith(query)
        
        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1
        
        return a.name.localeCompare(b.name)
      })
    })

    const effectiveness = computed(() => {
      if (!selectedPokemon.value) return null
      const pokemonTypes = getPokemonTypes(selectedPokemon.value, selectedGeneration.value)
      return categorizeEffectiveness(pokemonTypes, selectedGeneration.value)
    })

    const currentPokemonTypes = computed(() => {
      if (!selectedPokemon.value) return []
      return getPokemonTypes(selectedPokemon.value, selectedGeneration.value)
    })

    const availableGenerations = computed(() => {
      if (!selectedPokemon.value) return [1, 2, 3, 'orre', 4, 5, 6, 7, 8, 9]
      
      const pokemon = selectedPokemon.value
      const generations = []
      
      // Determine the first generation this Pokémon appeared in based on ID
      let firstGeneration = 1
      if (pokemon.id >= 152 && pokemon.id <= 251) firstGeneration = 2
      else if (pokemon.id >= 252 && pokemon.id <= 386) firstGeneration = 3
      else if (pokemon.id >= 387 && pokemon.id <= 493) firstGeneration = 4
      else if (pokemon.id >= 494 && pokemon.id <= 649) firstGeneration = 5
      else if (pokemon.id >= 650 && pokemon.id <= 721) firstGeneration = 6
      else if (pokemon.id >= 722 && pokemon.id <= 809) firstGeneration = 7
      else if (pokemon.id >= 810 && pokemon.id <= 898) firstGeneration = 8
      else if (pokemon.id >= 906 && pokemon.id <= 1025) firstGeneration = 9
      
      // Add all generations from first appearance onwards
      for (let gen = firstGeneration; gen <= 9; gen++) {
        generations.push(gen)
      }
      
      // Add Orre region if Pokémon existed in Gen 3 or earlier (Colosseum/XD only had Gen 1-3 Pokémon)
      if (firstGeneration <= 3) {
        // Insert Orre after Gen 3
        const gen3Index = generations.indexOf(3)
        if (gen3Index !== -1) {
          generations.splice(gen3Index + 1, 0, 'orre')
        }
      }
      
      return generations
    })

    function onSearchInput() {
      showSuggestions.value = true
      highlightedIndex.value = -1
    }

    function onKeyDown(event) {
      if (!showSuggestions.value || filteredPokemon.value.length === 0) return

      const maxIndex = Math.min(filteredPokemon.value.length - 1, 9) // Max 10 suggestions

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          highlightedIndex.value = highlightedIndex.value < maxIndex ? highlightedIndex.value + 1 : 0
          break
        case 'ArrowUp':
          event.preventDefault()
          highlightedIndex.value = highlightedIndex.value > 0 ? highlightedIndex.value - 1 : maxIndex
          break
        case 'Enter':
          event.preventDefault()
          if (highlightedIndex.value >= 0) {
            selectPokemon(filteredPokemon.value[highlightedIndex.value])
          } else if (filteredPokemon.value.length > 0) {
            selectPokemon(filteredPokemon.value[0])
          }
          break
        case 'Escape':
          showSuggestions.value = false
          highlightedIndex.value = -1
          searchInput.value.blur()
          break
      }
    }

    function selectPokemon(pokemon) {
      selectedPokemon.value = pokemon
      searchQuery.value = pokemon.name
      showSuggestions.value = false
      highlightedIndex.value = -1
      
      // Auto-adjust generation selection if current generation is not available for this Pokémon
      nextTick(() => {
        const available = availableGenerations.value
        if (!available.includes(selectedGeneration.value)) {
          // Default to the first available generation (when the Pokémon was introduced)
          selectedGeneration.value = available[0]
        }
        searchInput.value.blur()
      })
    }

    function onBlur() {
      // Delay hiding suggestions to allow click events on suggestions
      setTimeout(() => {
        showSuggestions.value = false
        highlightedIndex.value = -1
      }, 150)
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function getTypeColor(type) {
      return typeColors[type] || '#68A090'
    }

    return {
      searchQuery,
      selectedPokemon,
      showSuggestions,
      highlightedIndex,
      searchInput,
      selectedGeneration,
      filteredPokemon,
      effectiveness,
      currentPokemonTypes,
      availableGenerations,
      onSearchInput,
      onKeyDown,
      selectPokemon,
      onBlur,
      capitalize,
      getTypeColor,
      getPokemonDisplayName,
      generationLabels
    }
  }
}
</script>