# Hungarian Parliament Electoral Bias Visualizer

## Project Overview

An interactive web application that visualizes how various electoral system distortions in Hungary affect the distribution of parliamentary seats. The tool demonstrates the gap between voter preferences and actual seat allocation by modeling two distinct categories of electoral biases.

## Core Concept

The fundamental insight of this project is that electoral biases operate at **two different stages**:

### 1. Vote-Gathering Biases (Szavazatszerzési torzítások)
These affect the **number of votes** a party receives BEFORE they enter the electoral system:
- **State propaganda** - Government-controlled media dominance (77.8% of news media by 2019)
- **Vote buying** - Public fund campaigns, pressure on public workers
- **Border mail voting** - 95-96% of cross-border Hungarian voters support Fidesz
- **Embassy voting restrictions** - Western Hungarians face 6x lower participation rates

**Key insight**: Poll data (e.g., from taktikaiszavazas.hu) **already includes** these effects. Polls measure "distorted" voter intent, not "true" preferences.

### 2. Seat-Conversion Biases (Mandátumszámítási torzítások)  
These affect how votes are **converted into seats**:
- **Gerrymandering** - 2011 redistricting favored Fidesz strongholds
- **Abolition of two-round voting** - Prevents tactical opposition coordination
- **Winner compensation (Győzteskompenzáció)** - Surplus votes transfer to party list (helps **whoever wins**)
- **Parliament size reduction** - 386→199 seats amplified majority effects
- **Minority MP** - German minority representative consistently votes with government
- **Electoral system weighting** - Mixed system inherently favors winners (since 1989, not Fidesz-specific)

## Data Flow Model

```
┌─────────────────────────┐
│   "Fair" Preference     │  ← Theoretical: what people would vote WITHOUT propaganda
│   (User-adjustable)     │
└───────────┬─────────────┘
            │
            ▼ + Vote-gathering biases (propaganda, vote buying...)
┌─────────────────────────┐
│   Measured Votes        │  ← This is what polls actually measure
│   (Default from polls)  │     Default: Tisza 40%, Fidesz 28%, Mi Hazánk 5%
└───────────┬─────────────┘
            │
            ▼ + Seat-conversion biases (gerrymandering, winner compensation...)
┌─────────────────────────┐
│   Final Seat Count      │  ← Actual parliament composition
│   (199 total seats)     │
└─────────────────────────┘
```

## User Interface Requirements

### Parliament Visualization (Horseshoe)
- Authentic Hungarian Parliament layout: curved arc at top + two vertical "legs"
- **Column-based coloring** (diagonal boundaries, not horizontal rows)
- Seats are rounded rectangles, not circles
- Left side: Tisza (blue) + Mi Hazánk (green at edge)
- Right side: Fidesz (orange)
- Scale bar showing 100 (majority) and 133 (2/3) thresholds at correct positions

### Controls Panel
- **Vote Input Sliders**: User sets "Measured Votes" (poll data), system calculates "Fair Preference"
- **Bias Factor Toggles**: Each factor can be enabled/disabled with a switch
- **Bias Factor Sliders**: Adjust estimated seat impact of each factor
- **Visual indicators on sliders**: Show the calculated fair value when biases are enabled

### Transformation Pipeline Display
- Three vertical boxes: Fair Preference → Measured Votes → Final Seats
- Numbers displayed horizontally within each box (Tisza | Fidesz | Mi Hazánk)
- Arrows between boxes with explanatory text

### Bilingual Support
- Hungarian (default) and English
- Language toggle in header
- All UI text, factor names, descriptions, and tooltips translated

## Technical Requirements

### Framework
- Next.js 16 (App Router)
- React with "use client" directive (client-side rendering to avoid hydration issues)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

### Key Technical Decisions
1. **Client-side only rendering** for parliament SVG to avoid floating-point hydration mismatches
2. **`mounted` state pattern** - SVG seats only render after `useEffect` confirms client-side
3. **Integer rounding** for SVG coordinates
4. **`suppressHydrationWarning`** on SVG as additional safety

### State Management
```typescript
// User inputs measured votes (from polls)
const [measuredVotes, setMeasuredVotes] = useState<VoteShare>(DEFAULT_MEASURED_VOTES)

// Factor toggles and values
const [voteFactors, setVoteFactors] = useState<Factor[]>(voteGatheringFactors)
const [seatFactors, setSeatFactors] = useState<Factor[]>(seatConversionFactors)

// Calculated: fair votes = measured votes MINUS propaganda effects
const fairVotes = useMemo(() => {
  // If biases enabled: calculate what votes would be without propaganda
  // If biases disabled: fair = measured
}, [measuredVotes, voteFactors])

// Effective votes for seat calculation depends on bias state
const effectiveVotes = anyVoteBiasEnabled ? measuredVotes : fairVotes
```

### Winner-Favoring Logic
Some biases help Fidesz specifically, others help **whoever is winning**:
```typescript
const winner = effectiveVotes.tisza >= effectiveVotes.fidesz ? "tisza" : "fidesz"

// Winner compensation, electoral weighting, parliament size reduction
// → Apply bonus to `winner`, not always to Fidesz
```

## Design Specifications

### Color Palette (Dark Theme)
- **Background**: Deep blue-gray (#0c1117)
- **Card backgrounds**: Semi-transparent with backdrop blur
- **Primary accent**: Golden (#e8a838)
- **Tisza**: Blue (#5b9bd5)
- **Fidesz**: Orange/Gold (#e8a838)  
- **Mi Hazánk**: Green (#6ab04c)
- **Other/Empty**: Gray (#6b7280)

### Typography
- **Font**: Inter (sans-serif only, no serif fonts)
- **Heading**: Bold, large (3xl-5xl responsive)
- **Body**: Regular weight, relaxed line-height

### Visual Elements
- Top accent bar: Gradient using party colors
- Cards: Semi-transparent with subtle borders
- Switches: High contrast for dark background (zinc-500/600 when unchecked)
- No logo or decorative elements

## References & Sources

The tool should include collapsible references section with academic sources:
- CEU Democracy Institute studies
- OSCE/ODIHR election observation reports  
- Politikatudományi Szemle (Hungarian Political Science Review)
- Public Choice academic journal (Springer)
- Independent analyses from szavaz.at, maszol.ro

## Default Values (from 2026 polling)

```typescript
const DEFAULT_MEASURED_VOTES = {
  tisza: 40,    // ~40% in polls
  fidesz: 28,   // ~28% in polls
  mihazank: 5,  // ~5% in polls
}

// Estimated bias impacts (in seats, adjustable)
// Vote-gathering:
- Propaganda: +5 seats to Fidesz
- Vote buying: +3 seats
- Border mail voting: +3 seats
- Embassy restrictions: +2 seats

// Seat-conversion:
- Gerrymandering: +6 seats to Fidesz
- Two-round abolition: +5 seats
- Winner compensation: +5 seats (to WINNER)
- Parliament reduction: +3 seats (to WINNER)
// etc.
```

## Key Behaviors

1. **Toggling vote-gathering biases OFF** should:
   - Update the slider indicators to show fair vs measured difference
   - Update the parliament horseshoe to show what seats would look like with fair votes
   - Update the transformation pipeline display

2. **Toggling seat-conversion biases** should:
   - Update final seat counts
   - Update parliament horseshoe
   - Winner-favoring biases should dynamically adjust based on who's leading

3. **Changing vote percentages** should:
   - Immediately update all visualizations
   - Recalculate fair preference if vote biases are enabled
   - Potentially change which party benefits from winner-favoring biases

## File Structure

```
/app
  layout.tsx      # Root layout with Inter font, dark theme
  page.tsx        # Simple wrapper, renders ParliamentVisualization
  globals.css     # Tailwind config, dark theme tokens

/components
  parliament-visualization.tsx   # Main component (~1000 lines)
    - Translations object (hu/en)
    - Party colors constant
    - Factor definitions (vote-gathering & seat-conversion)
    - ParliamentSeats component (horseshoe SVG)
    - FactorControl component (toggle + slider + description)
    - PipelineStage component (transformation display)
    - Main ParliamentVisualization export

  /ui              # shadcn components
    switch.tsx     # Modified for dark theme visibility
    slider.tsx
    card.tsx
    button.tsx
    tooltip.tsx
    collapsible.tsx
    ... etc
```

---

This document should provide sufficient context for continuing development, fixing issues, or extending the visualization with new features.
