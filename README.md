# Hungary Election Bias Simulator

An interactive visualization tool that demonstrates how Hungary's electoral system converts poll numbers into parliamentary seats, highlighting the various structural biases in the system.

**Live Demo:** [lejtapalya.hu](https://lejtapalya.hu)

## Overview

Hungary uses a mixed electoral system combining:
- **106 Single-Member District (SMD) seats** - Winner-take-all in each district
- **93 National List seats** - Proportional representation using D'Hondt method
- **5% parliamentary threshold** - Parties below this cannot enter parliament

This simulator allows users to:
- Adjust poll numbers and see resulting seat distributions
- Toggle various biases (opinion-forming, foreign votes, seat conversion)
- Understand the "tilted playing field" effect in Hungarian elections
- View results in both Hungarian and English

## How the Calculation Works

The seat calculation follows these steps:

```
Poll Data → SMD Seats + List Seats → Apply Biases → Final Seats
```

For a detailed explanation with code references, see [METHODOLOGY.md](./METHODOLOGY.md).

### Quick Summary

1. **SMD Seats (106)**: Winner-take-all with ~1% Fidesz structural advantage and non-linear winner bonus
2. **List Seats (93)**: D'Hondt proportional allocation among parties passing 5% threshold
3. **Bias Adjustments**: Optional seat transfers based on various electoral advantages

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion
- **Testing:** Jest with Testing Library
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/gazdagergo/hungary-election-bias-simulator.git
cd hungary-election-bias-simulator

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   └── layout.tsx         # Root layout
├── components/
│   ├── parliament-visualization.tsx  # Main visualization component
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── seat-calculation.ts      # Core seat calculation algorithms
│   └── seat-calculation.test.ts # Unit tests (47 test cases)
└── METHODOLOGY.md         # Detailed calculation methodology
```

## Contributing

We welcome contributions! This is an open-source project aimed at increasing transparency about electoral systems.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests to ensure nothing breaks**
   ```bash
   pnpm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Contribution Ideas

- **Translations:** Add support for more languages
- **Accessibility:** Improve screen reader support
- **Documentation:** Clarify methodology or add examples
- **Features:** Add new bias factors or visualization modes
- **Bug fixes:** Report or fix issues you find
- **Testing:** Add more test coverage

### Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Keep components focused and modular
- Add tests for new calculation logic

## Methodology Sources

This simulator is a simplified educational model inspired by:
- [taktikaiszavazas.hu](https://taktikaiszavazas.hu/modszertan) - Hungarian electoral analysis methodology
- Hungarian electoral law and historical election data

**Note:** This is a simplified model for understanding biases. Real forecasting requires district-level data and turnout modeling.

## License

This project is open source. Feel free to use, modify, and distribute.

## Contact

- **Operator:** Gergely Gazda
- **Email:** gergo@lejtapalya.hu
- **Issues:** [GitHub Issues](https://github.com/gazdagergo/hungary-election-bias-simulator/issues)

---

Made with the goal of increasing transparency in electoral systems.
