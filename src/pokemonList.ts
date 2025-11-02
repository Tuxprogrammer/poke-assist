// Combined Pokémon list from all generations
// Imports all regional Pokémon data and combines into a single comprehensive list

import { pokemonRBGY } from './pokemon/pokemonRBGY';
import { pokemonGSC } from './pokemon/pokemonGSC';
import { pokemonRSE } from './pokemon/pokemonRSE';
import { pokemonDPPt } from './pokemon/pokemonDPPt';
import { pokemonBW } from './pokemon/pokemonBW';
import { pokemonXY } from './pokemon/pokemonXY';
import { pokemonSM } from './pokemon/pokemonSM';
import { pokemonSwSh } from './pokemon/pokemonSwSh';
import { pokemonSV } from './pokemon/pokemonSV';
import type { Pokemon } from './pokemonData';

/**
 * Complete Pokémon list containing all Pokémon from all generations and regions
 *
 * Data includes:
 * - Generation 1: Red, Blue, Green, Yellow (Kanto) - IDs 1-151
 * - Generation 2: Gold, Silver, Crystal (Johto) - IDs 152-251
 * - Generation 3: Ruby, Sapphire, Emerald (Hoenn) - IDs 252-386
 * - Generation 4: Diamond, Pearl, Platinum (Sinnoh) - IDs 387-493
 * - Generation 5: Black, White, Black 2, White 2 (Unova) - IDs 494-649
 * - Generation 6: X, Y, Omega Ruby, Alpha Sapphire (Kalos) - IDs 650-721
 * - Generation 7: Sun, Moon, Ultra Sun, Ultra Moon (Alola) - IDs 722-809
 * - Generation 8: Sword, Shield, Brilliant Diamond, Shining Pearl (Galar) - IDs 810-905
 * - Generation 9: Scarlet, Violet (Paldea) - IDs 906-1025
 * - Orre Region: Colosseum, XD: Gale of Darkness (Shadow Pokémon)
 *
 * Features:
 * - Regional variants (Alolan, Galarian, Hisuian, Paldean forms)
 * - Mega Evolutions
 * - Paradox Pokémon
 * - Shadow Pokémon from Orre region
 * - Form variations with proper type changes
 * - Generation-specific type assignments (e.g., Fairy type introduction in Gen 6)
 *
 * @type {Pokemon[]} Array of all Pokémon data objects
 */
export const pokemonList: Pokemon[] = ([
  ...pokemonRBGY,    // Gen 1: Kanto (001-151)
  ...pokemonGSC,     // Gen 2: Johto (152-251)
  ...pokemonRSE,     // Gen 3: Hoenn (252-386)
  ...pokemonDPPt,    // Gen 4: Sinnoh (387-493)
  ...pokemonBW,      // Gen 5: Unova (494-649)
  ...pokemonXY,      // Gen 6: Kalos (650-721)
  ...pokemonSM,      // Gen 7: Alola (722-809)
  ...pokemonSwSh,    // Gen 8: Galar (810-905)
  ...pokemonSV,      // Gen 9: Paldea (906-1025)
] as Pokemon[]).sort((a, b) => a.id - b.id); // Sort by Pokédex ID for consistent ordering

export default pokemonList;
