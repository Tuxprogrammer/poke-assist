# Claude AI Assistant Instructions

## Project Overview

This is the Poke-Assist project - a Vue.js web application for Pokémon type effectiveness lookup. Users can search for Pokémon and view type matchups against them.

## Key Project Information

- **Framework**: Vue 3 with Composition API and TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with type-specific color coding
- **Data**: Static JSON data structures for Pokémon and type charts

## Important Files

- `src/App.vue` - Main application component
- `src/pokemonData.ts` - Core Pokémon database and type effectiveness logic
- `src/pokemonList.ts` - Pokémon data definitions
- `src/pokemon/` - Generation-specific Pokémon data files
- `vite.config.ts` - Build configuration
- `index.html` - Main HTML file with embedded styles

## Development Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Architecture Notes

- Uses Vue 3 Composition API with `<script setup>` syntax
- TypeScript for type safety
- Reactive search with autocomplete functionality
- Type effectiveness calculations for dual-type Pokémon
- Color-coded type badges for visual identification

## Extension Opportunities

- Integration with PokéAPI for complete Pokédex
- Move effectiveness calculations
- Pokémon sprites/images
- Team builder functionality
- Battle simulator features

## Development Guidelines

- Follow Vue 3 best practices
- Use TypeScript for new code
- Maintain type safety throughout
- Keep performance in mind for large datasets
- Follow existing code patterns and conventions
