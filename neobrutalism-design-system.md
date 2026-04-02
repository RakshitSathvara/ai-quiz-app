# Neobrutalism Design System — Admin Panel & User Details

A comprehensive design reference for restyling the admin dashboard and user details screen using the neobrutalism aesthetic. All tokens are implementation-ready for Tailwind CSS v4.

---

## 1. Design Philosophy

Neobrutalism emphasizes **explicitness over subtlety, personality over invisibility, and memorable structure over perfect polish**. Every element declares its purpose through thick borders, hard shadows, bold colors, and confident typography — no gradients, no soft glows, no blurred backgrounds.

---

## 2. Color Palette

### Core Palette

| Token              | Hex       | Usage                                      |
| ------------------- | --------- | ------------------------------------------ |
| `--nb-black`        | `#000000` | Borders, shadows, primary text             |
| `--nb-white`        | `#FFFDF5` | Page background, card backgrounds          |
| `--nb-yellow`       | `#FFD23F` | Primary accent, CTA buttons, highlights    |
| `--nb-pink`         | `#FF6B6B` | Error states, fail badges, alerts          |
| `--nb-blue`         | `#74B9FF` | Info states, links, focus rings            |
| `--nb-green`        | `#88D498` | Success states, pass badges, positive data |
| `--nb-orange`       | `#FFA552` | Warnings, secondary CTA, hover accents     |
| `--nb-lavender`     | `#B8A9FA` | Decorative accents, chart segments         |

### Extended Surface Colors

| Token                   | Hex       | Usage                            |
| ------------------------- | --------- | -------------------------------- |
| `--nb-surface`           | `#FFFDF5` | Default card/container fill      |
| `--nb-surface-alt`       | `#FFF3E0` | Alternate rows, secondary cards  |
| `--nb-surface-elevated`  | `#FFFFFF` | Modals, dropdowns, popovers     |
| `--nb-surface-muted`     | `#F5F0E8` | Disabled states, subtle sections |

### Semantic Colors (Admin Panel)

| State     | Background  | Text / Icon | Border    |
| --------- | ----------- | ----------- | --------- |
| Success   | `#88D498`   | `#000000`   | `#000000` |
| Error     | `#FF6B6B`   | `#000000`   | `#000000` |
| Warning   | `#FFA552`   | `#000000`   | `#000000` |
| Info      | `#74B9FF`   | `#000000`   | `#000000` |
| Neutral   | `#F5F0E8`   | `#000000`   | `#000000` |

### Contrast Requirements

- All text-on-background combinations must meet **WCAG AA** (minimum 4.5:1 for normal text, 3:1 for large text).
- Black text (`#000000`) on all palette colors passes AA.
- Avoid white text on yellow or light green backgrounds.

---

## 3. Typography

### Font Stack

| Role      | Font Family    | Weight | Fallback                     |
| --------- | -------------- | ------ | ---------------------------- |
| Display   | Syne           | 800    | Arial Black, sans-serif      |
| Heading   | Space Grotesk  | 700    | system-ui, sans-serif        |
| Body      | Inter          | 400    | system-ui, sans-serif        |
| Mono      | Space Mono     | 400/700| Menlo, monospace             |

### Type Scale

| Token         | Size    | Line Height | Usage                               |
| ------------- | ------- | ----------- | ----------------------------------- |
| `--nb-text-xs`  | 0.75rem | 1rem        | Micro labels, timestamps            |
| `--nb-text-sm`  | 0.875rem| 1.25rem     | Table cells, secondary text         |
| `--nb-text-base`| 1rem    | 1.5rem      | Body text, form inputs              |
| `--nb-text-lg`  | 1.125rem| 1.75rem     | Card descriptions, lead text        |
| `--nb-text-xl`  | 1.25rem | 1.75rem     | Section headings                    |
| `--nb-text-2xl` | 1.5rem  | 2rem        | Card titles, stat labels            |
| `--nb-text-3xl` | 1.875rem| 2.25rem     | Page section titles                 |
| `--nb-text-4xl` | 2.25rem | 2.5rem      | Page titles, hero text              |
| `--nb-text-5xl` | 3rem    | 1           | Dashboard stat numbers              |

### Typography Rules

- Headlines use **Syne 800** — set larger than feels comfortable. This is intentional.
- Body text uses **Inter 400** for maximum readability at small sizes.
- Labels, badges, and code snippets use **Space Mono** for a raw, technical feel.
- Letter spacing: `-0.02em` on display text, `0` on body, `0.05em` on uppercase labels.

---

## 4. Borders & Shapes

### Border Tokens

| Token             | Value             | Usage                           |
| ----------------- | ----------------- | ------------------------------- |
| `--nb-border-thin`  | `2px solid #000`  | Inputs, subtle dividers         |
| `--nb-border`       | `3px solid #000`  | Default for cards, buttons      |
| `--nb-border-thick` | `4px solid #000`  | Emphasized elements, stat cards |

### Border Radius

| Token            | Value  | Usage                                   |
| ---------------- | ------ | --------------------------------------- |
| `--nb-radius-none` | `0px`  | Default — sharp square corners          |
| `--nb-radius-sm`   | `4px`  | Subtle rounding for buttons, inputs     |
| `--nb-radius-base` | `8px`  | Cards, containers (optional softening)  |

**Rule**: Default to `0px` (sharp corners). Use `4px` or `8px` sparingly and only for friendliness on interactive elements. Never exceed `8px`.

### Shape Language

- **Geometric primitives only**: rectangles, squares, circles. No organic/blob shapes.
- **Stacked layers**: Overlap cards or elements with visible offset to create depth.
- **Grid-aligned**: All elements snap to an 8px grid for consistent alignment.

---

## 5. Shadows

Hard offset shadows with **zero blur** — the defining visual trait of neobrutalism.

### Shadow Tokens

| Token              | Value                  | Usage                             |
| ------------------ | ---------------------- | --------------------------------- |
| `--nb-shadow-sm`     | `3px 3px 0 0 #000`    | Buttons, badges, small elements   |
| `--nb-shadow`        | `5px 5px 0 0 #000`    | Cards, inputs, default components |
| `--nb-shadow-lg`     | `8px 8px 0 0 #000`    | Stat cards, elevated sections     |
| `--nb-shadow-xl`     | `12px 12px 0 0 #000`  | Modals, hero cards, emphasis      |
| `--nb-shadow-none`   | `none`                 | Pressed/active state              |

### Shadow Rules

- **Always zero blur** — soft shadows are forbidden.
- Shadow color is always `#000000` for maximum contrast.
- Shadow direction is always **bottom-right** (positive X and Y offset).
- Shadow size indicates visual importance: bigger shadow = more prominent element.

---

## 6. Animations & Interactions

### Hover State

```css
.nb-hover {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.nb-hover:hover {
  transform: translate(-2px, -2px);
  /* Shadow grows — element appears to lift */
  box-shadow: 7px 7px 0 0 #000; /* from 5px default */
}
```

### Active / Pressed State

```css
.nb-hover:active {
  transform: translate(3px, 3px);
  box-shadow: none; /* element appears to press flat */
}
```

### Focus State

```css
.nb-focus:focus-visible {
  outline: 3px solid #74B9FF;
  outline-offset: 2px;
}
```

### Transition Defaults

| Property           | Duration | Easing     |
| ------------------ | -------- | ---------- |
| Transform + shadow | 0.15s    | ease       |
| Background color   | 0.1s     | ease       |
| Opacity            | 0.2s     | ease-in-out|
| Border color       | 0.1s     | ease       |

### Micro-Animations

| Animation     | Description                                              | Usage                    |
| ------------- | -------------------------------------------------------- | ------------------------ |
| Lift-on-hover | Element shifts up-left, shadow expands                   | Buttons, cards, links    |
| Press-flat    | Element shifts down-right, shadow collapses to zero      | Click/tap feedback       |
| Shake         | 2-3px horizontal jitter (2 cycles, 0.3s)                | Error validation         |
| Slide-in      | `translateY(20px) → 0` with `opacity: 0 → 1`, 0.3s     | Page load, card entrance |
| Count-up      | Number increments from 0 to final value over 0.6s       | Stat numbers on load     |
| Pulse-border  | Border color cycles between black and accent, 1.5s       | Active/selected state    |

### Motion Rules

- Transitions are **short and snappy** — never exceed 0.3s for interactive elements.
- No elastic/bounce easing — use `ease` or `ease-in-out` only.
- Reduce motion: respect `prefers-reduced-motion` by disabling transforms and using opacity-only transitions.

---

## 7. Spacing System

Based on an **8px grid**:

| Token          | Value  |
| -------------- | ------ |
| `--nb-space-1`   | 4px    |
| `--nb-space-2`   | 8px    |
| `--nb-space-3`   | 12px   |
| `--nb-space-4`   | 16px   |
| `--nb-space-5`   | 20px   |
| `--nb-space-6`   | 24px   |
| `--nb-space-8`   | 32px   |
| `--nb-space-10`  | 40px   |
| `--nb-space-12`  | 48px   |
| `--nb-space-16`  | 64px   |

### Spacing Rules

- Card internal padding: `24px–32px`
- Gap between cards in a grid: `16px–24px`
- Page margin: `32px` (desktop), `16px` (mobile)
- Generous whitespace around dense elements prevents visual overload.

---

## 8. Component Specifications

### 8.1 Buttons

```
┌─────────────────────────┐
│   Button Label           │ ← 3px solid black border
└─────────────────────────┘
  ■■■■■■■■■■■■■■■■■■■■■■■■  ← 5px 5px hard shadow
```

| Variant   | Background  | Text      | Border        | Shadow           |
| --------- | ----------- | --------- | ------------- | ---------------- |
| Primary   | `#FFD23F`   | `#000000` | `3px solid #000` | `5px 5px 0 0 #000` |
| Secondary | `#FFFDF5`   | `#000000` | `3px solid #000` | `5px 5px 0 0 #000` |
| Danger    | `#FF6B6B`   | `#000000` | `3px solid #000` | `5px 5px 0 0 #000` |
| Ghost     | transparent | `#000000` | `2px solid #000` | none             |

- Padding: `12px 24px`
- Font: Space Grotesk 700, `--nb-text-base`
- Border radius: `4px`
- Hover: lift + shadow grow
- Active: press flat + shadow collapse

### 8.2 Stat Cards (Dashboard)

```
┌──────────────────────────────┐
│  📊  Total Attempts          │ ← heading: Space Grotesk 700
│                              │
│         247                  │ ← stat number: Syne 800, 3rem
│                              │
│  ↑ 12% from last week       │ ← subtext: Inter 400, muted
└──────────────────────────────┘
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
```

- Background: rotate through `--nb-yellow`, `--nb-blue`, `--nb-green`, `--nb-lavender` per card
- Border: `4px solid #000`
- Shadow: `8px 8px 0 0 #000`
- Padding: `24px`
- Border radius: `0px` or `8px`
- Stat number uses count-up animation on load

### 8.3 Data Table (Attendees)

| Property          | Value                              |
| ----------------- | ---------------------------------- |
| Border            | `3px solid #000` on outer table    |
| Header bg         | `#FFD23F`                          |
| Header text       | `#000000`, Space Grotesk 700       |
| Row bg (even)     | `#FFFDF5`                          |
| Row bg (odd)      | `#FFF3E0`                          |
| Row hover         | `#74B9FF` (light blue tint)        |
| Cell padding      | `12px 16px`                        |
| Cell border       | `1px solid #000` between cells     |
| Sort icon         | Bold black arrow, no subtle grays  |

### 8.4 Badges / Status Pills

| Status  | Background | Text      | Border           |
| ------- | ---------- | --------- | ---------------- |
| Pass    | `#88D498`  | `#000000` | `2px solid #000` |
| Fail    | `#FF6B6B`  | `#000000` | `2px solid #000` |
| Pending | `#FFA552`  | `#000000` | `2px solid #000` |

- Font: Space Mono 700, uppercase, `--nb-text-xs`
- Padding: `4px 12px`
- Border radius: `4px`
- Shadow: `3px 3px 0 0 #000`

### 8.5 Cards (User Details, Answer Cards)

- Background: `#FFFDF5`
- Border: `3px solid #000`
- Shadow: `5px 5px 0 0 #000`
- Padding: `24px`
- Border radius: `0px`
- Correct answer highlight: left border `4px solid #88D498`
- Incorrect answer highlight: left border `4px solid #FF6B6B`

### 8.6 Form Inputs (Admin Login, Search)

- Background: `#FFFDF5`
- Border: `2px solid #000`
- Padding: `12px 16px`
- Font: Inter 400, `--nb-text-base`
- Border radius: `4px`
- Focus: border `3px solid #74B9FF`, shadow `3px 3px 0 0 #74B9FF`
- Placeholder color: `#000000` at 50% opacity

### 8.7 Charts (Score Distribution, Results Breakdown)

- Chart background: `#FFFDF5` with `3px solid #000` border
- Bar / donut segment colors: use palette in order — yellow, blue, green, pink, orange, lavender
- Axis labels: Space Mono 400
- Grid lines: `1px dashed #000` at 30% opacity
- Tooltips: `#000000` background, `#FFFDF5` text, `3px solid #FFD23F` border

### 8.8 Navigation / Sidebar

- Background: `#000000`
- Text: `#FFFDF5`, Space Grotesk 700
- Active item: `#FFD23F` background, `#000000` text
- Hover: `#FFD23F` at 30% opacity
- Border-right: `4px solid #FFD23F`

### 8.9 Progress Bars (Section Scores)

- Track background: `#F5F0E8`
- Track border: `2px solid #000`
- Fill color: gradient-free — solid `#88D498` (passing) or `#FF6B6B` (below threshold)
- Height: `12px`
- Border radius: `0px`
- Animation: width transition `0.6s ease` on load

### 8.10 Modal / Dialog

- Background: `#FFFDF5`
- Border: `4px solid #000`
- Shadow: `12px 12px 0 0 #000`
- Overlay: `#000000` at 50% opacity
- Border radius: `0px`
- Entry animation: slide-in from bottom, 0.2s

---

## 9. Tailwind CSS v4 Token Map

Ready to add to `globals.css` inside `@theme inline`:

```css
@theme inline {
  /* Neobrutalism Colors */
  --color-nb-black: #000000;
  --color-nb-white: #FFFDF5;
  --color-nb-yellow: #FFD23F;
  --color-nb-pink: #FF6B6B;
  --color-nb-blue: #74B9FF;
  --color-nb-green: #88D498;
  --color-nb-orange: #FFA552;
  --color-nb-lavender: #B8A9FA;
  --color-nb-surface: #FFFDF5;
  --color-nb-surface-alt: #FFF3E0;
  --color-nb-surface-muted: #F5F0E8;

  /* Neobrutalism Shadows */
  --shadow-nb-sm: 3px 3px 0 0 #000;
  --shadow-nb: 5px 5px 0 0 #000;
  --shadow-nb-lg: 8px 8px 0 0 #000;
  --shadow-nb-xl: 12px 12px 0 0 #000;

  /* Neobrutalism Border Radius */
  --radius-nb-none: 0px;
  --radius-nb-sm: 4px;
  --radius-nb-base: 8px;

  /* Neobrutalism Typography */
  --font-nb-display: 'Syne', 'Arial Black', sans-serif;
  --font-nb-heading: 'Space Grotesk', system-ui, sans-serif;
  --font-nb-body: 'Inter', system-ui, sans-serif;
  --font-nb-mono: 'Space Mono', 'Menlo', monospace;
}
```

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Space+Grotesk:wght@400;700&family=Inter:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
```

---

## 10. Accessibility Checklist

- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Focus states are visible with 3px blue outlines
- [ ] Interactive elements have `:focus-visible` styles
- [ ] `prefers-reduced-motion` disables transforms, uses opacity-only
- [ ] Touch targets are minimum 44x44px
- [ ] Color is not the sole indicator of status (pair with icons/text)
- [ ] Table headers use `<th scope="col">` for screen readers

---

## Sources

- [NN/g — Neobrutalism: Definition and Best Practices](https://www.nngroup.com/articles/neobrutalism/)
- [Neubrutalism.com — The Definitive Guide](https://neubrutalism.com/)
- [Neobrutalism.dev — Component Library](https://www.neobrutalism.dev/)
- [Bejamas — Neubrutalism Web Design Trend](https://bejamas.com/blog/neubrutalism-web-design-trend)
- [Medium — Neobrutalism Practical Guide](https://medium.com/design-bootcamp/neobrutalism-in-web-design-a-practical-guide-to-the-bold-ux-ui-trend-of-2024-making-it-usable-159c2ce327ad)
