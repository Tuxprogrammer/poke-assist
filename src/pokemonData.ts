// TypeScript type definitions
export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy' | 'shadow';

export type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'orre';
export type NumericGeneration = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TypeEffectiveness = 0 | 0.5 | 1 | 2;

export type TypeChart = Partial<Record<PokemonType, Partial<Record<PokemonType, TypeEffectiveness>>>>;

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  generationTypes?: Partial<Record<Generation, PokemonType[]>>;
  form?: string;
  region?: string;
}

export interface EffectivenessCategories {
  noEffect: PokemonType[];
  notVeryEffective: PokemonType[];
  normal: PokemonType[];
  superEffective: PokemonType[];
}

// Pokémon type effectiveness chart
// 0 = No effect, 0.5 = Not very effective, 1 = Normal effectiveness, 2 = Super effective
export const typeChart: TypeChart = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    ground: 2,
    steel: 0.5,
    dragon: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    ice: 0.5,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5,
  },
};

// Type colors for styling
export const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  shadow: '#4A148C',
};

// Function to get Pokemon types for a specific generation
export function getPokemonTypes(pokemon: Pokemon, generation: Generation = 9): PokemonType[] {
  // Handle Orre region (Colosseum & XD) - use Generation 3 mechanics
  if (generation === 'orre') {
    generation = 3;
  }

  if (pokemon.generationTypes && pokemon.generationTypes[generation]) {
    return pokemon.generationTypes[generation]!;
  }

  // Find the latest generation type that's <= the requested generation
  if (pokemon.generationTypes) {
    const availableGenerations = Object.keys(pokemon.generationTypes)
      .map(Number)
      .filter((gen) => typeof generation === 'number' && gen <= generation)
      .sort((a, b) => b - a);

    if (availableGenerations.length > 0) {
      const genKey = availableGenerations[0] as Generation;
      return pokemon.generationTypes[genKey]!;
    }
  }

  return pokemon.types;
}

// Orre region type chart (Colosseum & XD) - Based on Gen 3 with Shadow Pokemon mechanics
const orreTypeChart = {
  ...typeChart, // Uses same base effectiveness as Gen 3
  // Shadow type interactions (Shadow moves are super effective against all types except Shadow)
  shadow: {
    normal: 2,
    fire: 2,
    water: 2,
    electric: 2,
    grass: 2,
    ice: 2,
    fighting: 2,
    poison: 2,
    ground: 2,
    flying: 2,
    psychic: 2,
    bug: 2,
    rock: 2,
    ghost: 2,
    dragon: 2,
    dark: 2,
    steel: 2,
    shadow: 0.5,
  },
};

// Function to get effectiveness against a Pokemon's type combination
export function getTypeEffectiveness(
  attackingType: PokemonType,
  defendingTypes: PokemonType[],
  generation: Generation = 9
): TypeEffectiveness {
  let effectiveness: number = 1;

  // Use Orre-specific type chart for Shadow Pokemon mechanics
  const currentTypeChart = generation === 'orre' ? orreTypeChart : typeChart;

  for (const defType of defendingTypes) {
    const attackingTypeChart = currentTypeChart[attackingType] as Record<PokemonType, TypeEffectiveness> | undefined;
    const matchup = attackingTypeChart?.[defType] ?? 1;
    effectiveness *= matchup;
  }

  return effectiveness as TypeEffectiveness;
}

// Function to get which types exist in each generation
function getTypesForGeneration(generation: Generation): PokemonType[] {
  const baseTypes: PokemonType[] = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
  ];

  let availableTypes: PokemonType[] = [...baseTypes];

  // Dark and Steel types added in Generation 2
  if (typeof generation === 'number' && generation >= 2) {
    availableTypes.push('dark', 'steel');
  }

  // Fairy type added in Generation 6
  if (typeof generation === 'number' && generation >= 6) {
    availableTypes.push('fairy');
  }

  // Shadow type only exists in Orre region (Colosseum/XD)
  if (generation === 'orre') {
    availableTypes.push('shadow');
  }

  return availableTypes;
}

// Function to categorize all types by their effectiveness against a Pokemon
export function categorizeEffectiveness(
  defendingTypes: PokemonType[], 
  generation: Generation = 9
): EffectivenessCategories {
  const categories: EffectivenessCategories = {
    noEffect: [],
    notVeryEffective: [],
    normal: [],
    superEffective: [],
  };

  // Get types available in this generation
  const availableTypes = getTypesForGeneration(generation);

  for (const attackingType of availableTypes) {
    const effectiveness = getTypeEffectiveness(
      attackingType,
      defendingTypes,
      generation
    );

    if (effectiveness === 0) {
      categories.noEffect.push(attackingType);
    } else if (effectiveness < 1) {
      categories.notVeryEffective.push(attackingType);
    } else if (effectiveness > 1) {
      categories.superEffective.push(attackingType);
    } else {
      categories.normal.push(attackingType);
    }
  }

  return categories;
}

// Function to get display name for Pokemon (including form/region info)
export function getPokemonDisplayName(pokemon: Pokemon): string {
  let name = pokemon.name
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (pokemon.form) {
    name += ` (${pokemon.form})`;
  } else if (pokemon.region) {
    name += ` (${pokemon.region})`;
  }

  return name;
}
