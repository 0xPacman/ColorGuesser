
# 🎨 ColorGuesser

ColorGuesser is a single-page web application built with React, Vite, and Tailwind CSS. Test your color vision skills by matching a randomly generated target color using an interactive color wheel. Compete for high scores, earn streak bonuses, and climb the local leaderboard—all wrapped in a beautiful glassmorphism UI with slow-motion animated backgrounds.

## Features

- **Interactive Color Wheel:** Select colors using a full HSV spectrum wheel for precise matching.
- **Target Color Challenge:** Try to match the randomly generated target color as closely as possible.
- **Scoring System:** Earn points based on color accuracy, with streak bonuses for consecutive great guesses.
- **Leaderboard:** Track your best scores and compete locally with other players.
- **Player Profiles:** Join as a player, switch users, and save your progress.
- **Glassmorphism UI:** Modern, animated glass card effects and perfect text readability.
- **Slow-Motion Animated Background:** Relaxing gradient animation for a premium look.
- **Responsive Design:** Optimized for all screen sizes and devices.

## Screenshots

![ColorGuesser Screenshot](public/vite.svg)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
git clone https://github.com/0xPacman/ColorGuesser.git
cd ColorGuesser
npm install
```

### Running Locally

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to play.

### Build for Production

```bash
npm run build
```

## Project Structure

- `src/` — Main source code
  - `components/` — Game UI components
  - `utils/` — Color and storage utilities
  - `index.css` — Tailwind and custom glassmorphism styles
- `public/` — Static assets
- `tailwind.config.js` — Tailwind configuration
- `vite.config.js` — Vite configuration

## Customization

- **Background Animation Speed:** Easily adjust the gradient animation speed in `src/index.css`.
- **Glassmorphism Effects:** Tweak glass card and text shadow styles in `index.css` for your own look.

## Credits

- Built by [0xPacman](https://github.com/0xPacman)
- Powered by [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/)

## License

MIT
