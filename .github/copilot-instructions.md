# Copilot Instructions for Poke-Assist

## Project Overview
Poke-Assist is a Vue.js web application for Pokémon type effectiveness lookup. Users can search for Pokémon and view type matchups against them.

## Architecture & Tech Stack
- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite for development and bundling
- **Styling**: CSS-in-HTML with type-specific color coding
- **Data**: Static JSON data structures for Pokémon and type charts

## Development Guidelines

### Key Files & Structure
- `src/App.vue` - Main component with search and display logic
- `src/pokemonData.js` - Pokémon database, type chart, and effectiveness calculations
- `src/main.js` - Vue app initialization
- `vite.config.js` - Build configuration
- `index.html` - Contains embedded CSS and app mounting point

### Data Patterns
- **Type Effectiveness**: Stored as nested objects in `typeChart` (attacking type → defending type → multiplier)
- **Pokémon Data**: Array of objects with `{ id, name, types[] }` structure
- **Color Coding**: Each type has a specific hex color in `typeColors` object
- **Effectiveness Categories**: Calculated dynamically into `noEffect`, `notVeryEffective`, `normal`, `superEffective`

### Component Patterns
- Uses Vue 3 Composition API with `setup()` function
- Reactive data with `ref()` and `computed()` properties
- Event handling for keyboard navigation (arrows, enter, escape)
- Autocomplete with filtered suggestions and highlighted selection

### UI/UX Patterns
- **Search**: Real-time filtering with up to 10 visible suggestions
- **Type Badges**: Color-coded circular badges for visual type identification
- **Effectiveness Display**: Grouped by damage multipliers with clear labels
- **Responsive**: Single-column layout optimized for various screen sizes

### Development Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Extension Opportunities
- Add more Pokémon to `pokemonList` in `pokemonData.js`
- Integrate with PokéAPI for complete Pokédex
- Add move effectiveness calculations
- Include Pokémon sprites/images
- Add team builder functionality

## Notes for AI Agents
- **Type Chart**: Based on official Pokémon games (Generation 6+ with Fairy type)
- **Search Logic**: Prioritizes exact matches and beginning-of-string matches
- **Effectiveness Calculation**: Multiplies individual type matchups for dual-type Pokémon
- **Performance**: Currently handles ~35 Pokémon; consider virtualization for full 800+ Pokédex
- **Accessibility**: Uses semantic HTML and keyboard navigation for autocomplete

### Common Tasks
- Adding Pokémon: Extend `pokemonList` array with `{ id, name, types[] }`
- Type adjustments: Modify `typeChart` object with attacking → defending mappings
- Styling: Type colors in `typeColors`, main styles in `index.html`
- Search improvements: Modify filtering logic in `filteredPokemon` computed property