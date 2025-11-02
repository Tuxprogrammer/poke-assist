# Poke-Assist 🎮

A Vue.js web application for Pokémon type effectiveness lookup. Search for Pokémon and instantly view type matchups to gain the upper hand in battles!

## 🚀 Features

- **Fast Pokémon Search**: Real-time autocomplete search with keyboard navigation
- **Type Effectiveness Display**: Clear visualization of damage multipliers against selected Pokémon
- **Color-Coded Types**: Visual type identification with official Pokémon type colors
- **Dual-Type Support**: Accurate calculations for Pokémon with multiple types
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Vue 3** with Composition API and TypeScript
- **Vite** for fast development and building
- **CSS** with type-specific color theming
- **Static JSON** data for Pokémon and type charts

## 🏃‍♂️ Quick Start

### Prerequisites

- Docker
- Git

### Installation

#### Option 1: Quick Start with Pre-built Image

1. Pull and run the pre-built Docker image:

```bash
docker run -p 3000:80 ghcr.io/tuxprogrammer/poke-assist:latest
```

2. Open your browser and navigate to `http://localhost:3000`

#### Option 2: Build from Source

1. Clone the repository:

```bash
git clone https://github.com/Tuxprogrammer/poke-assist.git
cd poke-assist
```

2. Build the Docker image:

```bash
docker build -t poke-assist .
```

3. Run the application in a Docker container:

```bash
docker run -p 3000:80 poke-assist
```

4. Open your browser and navigate to `http://localhost:3000`

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🎯 How to Use

1. **Search**: Type a Pokémon name in the search box
2. **Select**: Click on a Pokémon from the suggestions or use arrow keys + Enter
3. **Analyze**: View the type effectiveness chart showing:
   - **No Effect** (0x damage) - Gray
   - **Not Very Effective** (0.25x, 0.5x damage) - Red
   - **Normal** (1x damage) - Default
   - **Super Effective** (2x, 4x damage) - Green

## 📁 Project Structure

```
src/
├── App.vue                 # Main application component
├── main.ts                 # Vue app initialization
├── pokemonData.ts          # Core type effectiveness logic
├── pokemonList.ts          # Pokémon database
└── pokemon/                # Generation-specific data
    ├── pokemonRBGY.ts      # Generation 1 (Red/Blue/Yellow)
    ├── pokemonGSC.ts       # Generation 2 (Gold/Silver/Crystal)
    ├── pokemonRSE.ts       # Generation 3 (Ruby/Sapphire/Emerald)
    ├── pokemonDPPt.ts      # Generation 4 (Diamond/Pearl/Platinum)
    ├── pokemonBW.ts        # Generation 5 (Black/White)
    ├── pokemonXY.ts        # Generation 6 (X/Y)
    ├── pokemonSM.ts        # Generation 7 (Sun/Moon)
    ├── pokemonSwSh.ts      # Generation 8 (Sword/Shield)
    └── pokemonSV.ts        # Generation 9 (Scarlet/Violet)
```

## 🔧 Configuration

The project uses Vite with TypeScript. Configuration files:

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules

## 🎨 Customization

### Adding New Pokémon

Add entries to the appropriate generation file in `src/pokemon/` following this structure:

```typescript
{ id: 1, name: "Bulbasaur", types: ["Grass", "Poison"] }
```

### Modifying Type Chart

Update the `typeChart` object in `src/pokemonData.ts` with effectiveness multipliers.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to your branch: `git push origin feature-name`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Pokémon type effectiveness data based on official Pokémon games
- Type colors inspired by the official Pokémon franchise
- Built with modern web technologies for optimal performance

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Tuxprogrammer/poke-assist/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about the bug or feature request

---

**Happy battling, trainers! 🔥⚡🌊🌿**
