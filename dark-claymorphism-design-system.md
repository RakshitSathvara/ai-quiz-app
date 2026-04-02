# Dark Claymorphism Design System
## AI Foundations Knowledge Quiz — TM Systems Pvt. Ltd.

---

## 1. Design Philosophy

Claymorphism creates a tactile, three-dimensional aesthetic where UI elements appear moulded from soft clay or plasticine. The signature effect comes from combining **outer shadows** (for depth and lift), **inner shadows** (for the inflated surface illusion), **rounded corners**, and **semi-transparent backgrounds**.

Adapting this to a **dark theme** requires a fundamental shift in how shadows and highlights work. On light backgrounds, shadows are dark below-right and light above-left. On dark backgrounds, the contrast flips — highlights become subtle bright glows on the upper-left edge, while shadows deepen into near-black on the lower-right. The semi-transparent card backgrounds shift from pastels to muted, desaturated tones with low opacity, allowing the dark canvas to bleed through and maintain the characteristic "clay surface" feel.

### Why Dark Claymorphism Works for a Developer Quiz

- Developers overwhelmingly prefer dark interfaces (80%+ in industry surveys)
- Reduced eye strain during extended assessment sessions
- The dark canvas makes the clay "glow" effect more dramatic and premium
- Higher perceived contrast between interactive and static elements
- Aligns with the existing TM Systems quiz aesthetic (dark navy base)

---

## 2. Colour Palette

### 2.1 Background & Canvas

| Token               | Value                  | Usage                                      |
|----------------------|------------------------|---------------------------------------------|
| `--bg-base`          | `#0B0F1A`              | Root page background (deepest layer)        |
| `--bg-gradient-from` | `#0D1225`              | Gradient start for subtle depth             |
| `--bg-gradient-to`   | `#111827`              | Gradient end                                |
| `--bg-surface`       | `rgba(20, 28, 50, 0.65)` | Main card/container background           |
| `--bg-elevated`      | `rgba(30, 40, 65, 0.60)` | Elevated cards (question cards, modals)  |
| `--bg-recessed`      | `rgba(10, 15, 30, 0.50)` | Inset areas (input fields, text areas)   |

**Background gradient implementation:**
```css
background: linear-gradient(145deg, var(--bg-gradient-from), var(--bg-gradient-to));
```

For a more immersive feel, use a radial gradient centred slightly above the viewport:
```css
background: radial-gradient(ellipse at 50% -20%, #1a2240 0%, #0B0F1A 70%);
```

### 2.2 Primary & Accent Colours

| Token              | Value                        | Usage                                           |
|--------------------|------------------------------|--------------------------------------------------|
| `--primary`        | `#5B8DEF`                    | Primary buttons, active states, links            |
| `--primary-glow`   | `rgba(91, 141, 239, 0.25)`   | Focus rings, active pagination dot glow          |
| `--primary-clay`   | `rgba(91, 141, 239, 0.30)`   | Primary clay card backgrounds                    |
| `--primary-muted`  | `rgba(91, 141, 239, 0.15)`   | Subtle highlights, selected option backgrounds   |

### 2.3 Semantic / Feedback Colours

| Token                | Value                         | Usage                                    |
|----------------------|-------------------------------|------------------------------------------|
| `--correct`          | `rgba(72, 199, 130, 0.35)`    | Correct answer card background           |
| `--correct-solid`    | `#48C782`                     | Correct badge text, check icons          |
| `--correct-glow`     | `rgba(72, 199, 130, 0.20)`    | Correct answer border glow               |
| `--incorrect`        | `rgba(235, 87, 87, 0.30)`     | Incorrect answer card background         |
| `--incorrect-solid`  | `#EB5757`                     | Incorrect badge text, cross icons        |
| `--incorrect-glow`   | `rgba(235, 87, 87, 0.18)`     | Incorrect answer border glow             |
| `--warning`          | `rgba(245, 180, 60, 0.35)`    | Justification required badge, warnings   |
| `--warning-solid`    | `#F5B43C`                     | Warning text, missing justification msg  |
| `--info`             | `rgba(130, 120, 210, 0.30)`   | AI explanation panels, scenario boxes    |
| `--info-solid`       | `#8278D2`                     | Info badge text, scenario headings       |

### 2.4 Text Colours

| Token           | Value                    | Usage                                       |
|-----------------|--------------------------|----------------------------------------------|
| `--text-primary`| `#E8E4EF`                | Headings, question text, primary content     |
| `--text-body`   | `#C4BFD0`                | Body text, option labels, descriptions       |
| `--text-muted`  | `#8A8498`                | Secondary info, hints, timestamps            |
| `--text-dim`    | `#5C576A`                | Disabled text, placeholders                  |
| `--text-inverse`| `#FFFFFF`                | Text on solid primary/accent backgrounds     |

### 2.5 Border & Divider Colours

| Token             | Value                      | Usage                                   |
|-------------------|----------------------------|-----------------------------------------|
| `--border-subtle` | `rgba(255, 255, 255, 0.06)`| Card borders, dividers                  |
| `--border-focus`  | `rgba(91, 141, 239, 0.40)` | Focus state borders on inputs           |
| `--border-correct`| `rgba(72, 199, 130, 0.50)` | Review card left border (correct)       |
| `--border-incorrect`| `rgba(235, 87, 87, 0.50)` | Review card left border (incorrect)    |

---

## 3. Claymorphism Shadow System

### 3.1 How Dark Clay Shadows Differ from Light

In light-theme claymorphism, shadows use black for the lower-right drop and white for the upper-left highlight. In a dark theme:

- The **outer drop shadow** uses a very deep near-black (`rgba(0,0,0,0.50–0.70)`) — it needs to be stronger because the background is already dark
- The **outer highlight** shifts from white to a very subtle light tone (`rgba(255,255,255,0.03–0.06)`) — just enough to define the upper edge without looking washed out
- The **inner highlight** (`inset` upper-left) uses a slightly brighter tone (`rgba(255,255,255,0.06–0.10)`) to create the clay "inflation"
- The **inner shadow** (`inset` lower-right) uses deep values (`rgba(0,0,0,0.25–0.40)`) for the concave effect

### 3.2 Shadow Tokens

| Token               | Value                                                                                                            | Usage                          |
|----------------------|------------------------------------------------------------------------------------------------------------------|--------------------------------|
| `--clay-shadow`      | `6px 6px 14px rgba(0,0,0,0.55), -3px -3px 10px rgba(255,255,255,0.04), inset 2px 2px 4px rgba(255,255,255,0.07), inset -2px -2px 4px rgba(0,0,0,0.30)` | Default raised element  |
| `--clay-shadow-deep` | `10px 10px 22px rgba(0,0,0,0.60), -5px -5px 14px rgba(255,255,255,0.05), inset 2px 2px 5px rgba(255,255,255,0.08), inset -2px -2px 5px rgba(0,0,0,0.35)` | Main containers, modals |
| `--clay-shadow-hover`| `8px 8px 18px rgba(0,0,0,0.60), -4px -4px 12px rgba(255,255,255,0.05), inset 2px 2px 5px rgba(255,255,255,0.08), inset -2px -2px 5px rgba(0,0,0,0.32)` | Hover lift effect       |
| `--clay-pressed`     | `3px 3px 6px rgba(0,0,0,0.45), inset 3px 3px 6px rgba(0,0,0,0.35), inset -2px -2px 4px rgba(255,255,255,0.05)` | Active/pressed buttons         |
| `--clay-inset`       | `inset 2px 2px 5px rgba(0,0,0,0.35), inset -1px -1px 3px rgba(255,255,255,0.05)`                                | Input fields, text areas       |

### 3.3 Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'clay':       '6px 6px 14px rgba(0,0,0,0.55), -3px -3px 10px rgba(255,255,255,0.04), inset 2px 2px 4px rgba(255,255,255,0.07), inset -2px -2px 4px rgba(0,0,0,0.30)',
        'clay-deep':  '10px 10px 22px rgba(0,0,0,0.60), -5px -5px 14px rgba(255,255,255,0.05), inset 2px 2px 5px rgba(255,255,255,0.08), inset -2px -2px 5px rgba(0,0,0,0.35)',
        'clay-hover': '8px 8px 18px rgba(0,0,0,0.60), -4px -4px 12px rgba(255,255,255,0.05), inset 2px 2px 5px rgba(255,255,255,0.08), inset -2px -2px 5px rgba(0,0,0,0.32)',
        'clay-press': '3px 3px 6px rgba(0,0,0,0.45), inset 3px 3px 6px rgba(0,0,0,0.35), inset -2px -2px 4px rgba(255,255,255,0.05)',
        'clay-inset': 'inset 2px 2px 5px rgba(0,0,0,0.35), inset -1px -1px 3px rgba(255,255,255,0.05)',
      },
      borderRadius: {
        'clay-sm': '14px',
        'clay':    '20px',
        'clay-lg': '28px',
        'clay-xl': '32px',
      },
    },
  },
};
```

---

## 4. Typography

### 4.1 Font Stack

| Role           | Font Family   | Weights Used  | Fallback Stack                      |
|----------------|---------------|---------------|--------------------------------------|
| **Display**    | Quicksand     | 600, 700, 800 | `'Quicksand', 'Nunito', sans-serif`  |
| **Body**       | Nunito         | 400, 500, 600, 700 | `'Nunito', 'Quicksand', sans-serif` |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 4.2 Type Scale

| Element                     | Font      | Weight | Size  | Line Height | Colour            | Letter Spacing |
|-----------------------------|-----------|--------|-------|-------------|-------------------|----------------|
| Page title                  | Quicksand | 800    | 30px  | 1.2         | `--text-primary`  | -0.02em        |
| Title accent (gradient)     | Quicksand | 800    | 30px  | 1.2         | `--primary`       | -0.02em        |
| Question heading            | Quicksand | 700    | 18px  | 1.45        | `--text-primary`  | 0              |
| Section header (results)    | Quicksand | 700    | 22px  | 1.3         | `--text-primary`  | 0              |
| Category badge              | Quicksand | 600    | 11px  | 1.0         | `--text-body`     | 0.5px          |
| Option text                 | Nunito    | 500    | 14.5px| 1.45        | `--text-body`     | 0              |
| Option letter (A/B/C/D)     | Quicksand | 700    | 13px  | 1.0         | `--text-body`     | 0              |
| Body / description          | Nunito    | 400    | 14px  | 1.55        | `--text-body`     | 0              |
| Explanation text             | Nunito    | 400    | 13px  | 1.5         | `--text-body`     | 0              |
| Input label                 | Quicksand | 700    | 14px  | 1.0         | `--text-primary`  | 0              |
| Input text / placeholder    | Nunito    | 500    | 15px  | 1.4         | `--text-primary` / `--text-dim` | 0 |
| Progress counter            | Nunito    | 600    | 13px  | 1.0         | `--text-muted`    | 0              |
| Score number (large)        | Quicksand | 800    | 56px  | 1.0         | `--text-primary`  | -0.03em        |
| Footer / credit             | Nunito    | 400    | 11px  | 1.4         | `--text-dim`      | 0.3px          |

### 4.3 Why These Fonts Work with Dark Claymorphism

Quicksand's rounded terminals echo the soft border-radius of clay elements, creating visual harmony between type and shape. Its geometric construction provides clarity at small sizes (badges) while remaining warm at display sizes. Nunito's generous x-height ensures readability against low-contrast dark backgrounds — critical for option text that users must scan quickly during an assessment.

---

## 5. Border Radius System

| Token          | Value  | Usage                                                    |
|----------------|--------|----------------------------------------------------------|
| `--radius-sm`  | 10px   | Badges, pagination dots, small pills                     |
| `--radius-md`  | 14px   | Option letter circles, input hints                       |
| `--radius-base`| 18px   | Option cards, buttons, input fields                      |
| `--radius-lg`  | 24px   | Question cards, form containers, result cards            |
| `--radius-xl`  | 32px   | Main outer container, modal dialogs                      |

**Rule of thumb:** Larger elements get proportionally larger radii. A 28px-tall badge uses ~10px radius; a full-width card uses ~24px. The main page wrapper uses the maximum 32px.

---

## 6. Component Specifications

### 6.1 Main Container (Outer Shell)

```css
.clay-container {
  background: var(--bg-surface);           /* rgba(20, 28, 50, 0.65) */
  border-radius: var(--radius-xl);          /* 32px */
  padding: 32px 26px 36px;
  box-shadow: var(--clay-shadow-deep);
  border: 1px solid var(--border-subtle);   /* rgba(255,255,255,0.06) */
}
```

### 6.2 Question Card

```css
.clay-question-card {
  background: var(--bg-elevated);           /* rgba(30, 40, 65, 0.60) */
  border-radius: var(--radius-lg);          /* 24px */
  padding: 24px 22px;
  box-shadow: var(--clay-shadow);
  border: 1px solid var(--border-subtle);
}
```

### 6.3 Option Card (Default State)

```css
.clay-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--radius-base);        /* 18px */
  background: rgba(255, 255, 255, 0.04);
  box-shadow: var(--clay-shadow);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Option states:**

| State      | Background                         | Border                              | Shadow                    | Transform          |
|------------|-------------------------------------|--------------------------------------|---------------------------|---------------------|
| Default    | `rgba(255,255,255,0.04)`           | `var(--border-subtle)`               | `var(--clay-shadow)`      | `none`              |
| Hover      | `rgba(255,255,255,0.07)`           | `rgba(255,255,255,0.10)`            | `var(--clay-shadow-hover)`| `translateY(-1px)`  |
| Selected   | `var(--primary-clay)`              | `rgba(91,141,239,0.35)`             | `var(--clay-pressed)`     | `scale(0.98)`       |
| Correct    | `var(--correct)`                   | `var(--border-correct)`              | `var(--clay-shadow)`      | `scale(1.01)`       |
| Incorrect  | `var(--incorrect)`                 | `var(--border-incorrect)`            | `var(--clay-shadow)`      | `scale(0.97)`       |

### 6.4 Button

```css
.clay-btn {
  border: none;
  border-radius: var(--radius-base);
  padding: 13px 28px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.clay-btn:active {
  box-shadow: var(--clay-pressed);
  transform: scale(0.95);
}
```

**Button variants:**

| Variant   | Background                      | Text Colour         |
|-----------|---------------------------------|---------------------|
| Primary   | `var(--primary)` (solid #5B8DEF)| `#FFFFFF`           |
| Ghost     | `rgba(255,255,255,0.06)`        | `var(--text-body)`  |
| Correct   | `var(--correct)`                | `var(--correct-solid)` |
| Danger    | `var(--incorrect)`              | `var(--incorrect-solid)` |

### 6.5 Input Field

```css
.clay-input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 16px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-recessed);
  box-shadow: var(--clay-inset);
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  color: var(--text-primary);
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.clay-input:focus {
  border-color: var(--border-focus);
  box-shadow: var(--clay-inset), 0 0 0 3px var(--primary-glow);
}

.clay-input::placeholder {
  color: var(--text-dim);
}
```

### 6.6 Progress Bar

```css
.clay-progress-track {
  width: 100%;
  height: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: var(--clay-inset);
  overflow: hidden;
}

.clay-progress-fill {
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--primary), #7BA8FF);
  box-shadow: inset 1px 1px 3px rgba(255, 255, 255, 0.15);
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 6.7 Badge / Pill

```css
.clay-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 10px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.30),
              inset 1px 1px 2px rgba(255, 255, 255, 0.06);
}
```

**Badge variants:**

| Variant        | Background         | Text Colour            |
|----------------|--------------------|------------------------|
| Category       | `var(--info)`      | `var(--info-solid)`    |
| Correct        | `var(--correct)`   | `var(--correct-solid)` |
| Incorrect      | `var(--incorrect)` | `var(--incorrect-solid)`|
| Warning        | `var(--warning)`   | `var(--warning-solid)` |
| Section (LLM)  | `rgba(255,175,130,0.25)` | `#FFB080`       |
| Section (PE)   | `var(--info)`      | `var(--info-solid)`    |

### 6.8 Pagination Dot

```css
.clay-dot {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

| State     | Background              | Text Colour      | Box Shadow              | Transform     |
|-----------|-------------------------|------------------|-------------------------|---------------|
| Default   | `rgba(255,255,255,0.05)`| `var(--text-dim)`| `none`                  | `scale(1)`    |
| Answered  | `var(--primary-muted)`  | `var(--primary)` | `none`                  | `scale(1)`    |
| Current   | `var(--primary)` (solid)| `#FFFFFF`        | `0 0 12px var(--primary-glow)` | `scale(1.1)` |

### 6.9 Modal Overlay

```css
.clay-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.50);
  backdrop-filter: blur(8px);
}

.clay-modal-card {
  background: rgba(20, 28, 50, 0.95);
  border-radius: var(--radius-xl);
  padding: 32px 28px;
  box-shadow: var(--clay-shadow-deep);
  border: 1px solid var(--border-subtle);
  max-width: 420px;
  width: 90%;
}
```

### 6.10 Scenario Box

```css
.clay-scenario {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 14px 16px;
  border-left: 4px solid var(--primary);
  box-shadow: var(--clay-inset);
}

.clay-scenario-label {
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 6px;
}
```

### 6.11 Answer Review Card

```css
.clay-review-card {
  background: var(--bg-elevated);
  border-radius: 22px;
  padding: 20px;
  box-shadow: var(--clay-shadow);
  border-left: 5px solid; /* colour set dynamically: --border-correct or --border-incorrect */
  margin-bottom: 14px;
}
```

### 6.12 Explanation Panel

```css
.clay-explanation {
  margin-top: 12px;
  padding: 12px 14px;
  background: var(--info);
  border-radius: 14px;
  box-shadow: inset 1px 1px 3px rgba(255, 255, 255, 0.04);
}

.clay-explanation-label {
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 11px;
  color: var(--text-body);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

---

## 7. Animation & Motion

### 7.1 Easing Curves

| Token                | Value                                  | Usage                                   |
|----------------------|----------------------------------------|-----------------------------------------|
| `--ease-spring`      | `cubic-bezier(0.34, 1.56, 0.64, 1)`   | Button press, card entry, option hover  |
| `--ease-smooth`      | `cubic-bezier(0.4, 0, 0.2, 1)`        | Progress bar fill, colour transitions   |
| `--ease-bounce`      | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | Score roll, correct pulse             |

The spring curve overshoots slightly (the `1.56` control point pushes past the target), giving interactions an elastic, physical feel that matches the malleable clay metaphor.

### 7.2 Keyframe Animations

```css
/* Card entrance — slide up with fade */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Screen transition — fade with subtle scale */
@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

/* Overlay fade */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Score counter roll */
@keyframes rollIn {
  from { opacity: 0; transform: translateY(-14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Floating icon (start/result screens) */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

/* Background gradient drift */
@keyframes bgShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Correct answer pulse */
@keyframes correctPulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.03); }
  100% { transform: scale(1); }
}

/* Glow ring for focus states */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.20); }
  50%      { box-shadow: 0 0 0 5px rgba(91, 141, 239, 0.35); }
}
```

### 7.3 Animation Usage Map

| Element              | Animation       | Duration | Easing          | Delay Pattern           |
|----------------------|-----------------|----------|-----------------|-------------------------|
| Screen transition    | `fadeScale`      | 350ms    | `--ease-spring` | None                    |
| Question card entry  | `slideUp`        | 350ms    | `--ease-spring` | None                    |
| Option cards         | `slideUp`        | 350ms    | `--ease-spring` | Stagger: `i × 60ms`    |
| Button press         | `scale(0.95)`    | 220ms    | `--ease-spring` | None                    |
| Option hover         | `translateY(-1px)` | 220ms  | `--ease-spring` | None                    |
| Selected option      | `scale(0.98)`    | 220ms    | `--ease-spring` | None                    |
| Correct feedback     | `correctPulse`   | 400ms    | `--ease-bounce` | None                    |
| Progress bar fill    | `width` transition| 500ms   | `--ease-spring` | None                    |
| Score roll           | `rollIn`         | 350ms    | `--ease-smooth` | None                    |
| Modal overlay        | `fadeIn`         | 200ms    | `ease`          | None                    |
| Modal card           | `fadeScale`      | 300ms    | `--ease-spring` | None                    |
| Review cards         | `slideUp`        | 350ms    | `--ease-spring` | Stagger: `i × 40ms`    |
| Background gradient  | `bgShift`        | 16s      | `ease`          | Infinite loop           |
| Floating icon        | `float`          | 3s       | `ease-in-out`   | Infinite loop           |
| Focus ring           | `glowPulse`      | 2s       | `ease-in-out`   | Infinite loop           |

### 7.4 Framer Motion Configuration (React / Next.js)

```jsx
// Card entrance
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 200, damping: 20 }}
/>

// Option stagger
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.06 }}
/>

// Screen transition wrapper
<AnimatePresence mode="wait">
  <motion.div
    key={screenKey}
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ type: "spring", stiffness: 260, damping: 24 }}
  />
</AnimatePresence>

// Score counter
<motion.span
  key={score}
  initial={{ opacity: 0, y: -14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
/>
```

---

## 8. Spacing System

| Token      | Value | Usage                                                |
|------------|-------|------------------------------------------------------|
| `--sp-1`   | 4px   | Tight gaps (badge clusters)                          |
| `--sp-2`   | 8px   | Badge-to-badge gap, pagination dot gap               |
| `--sp-3`   | 12px  | Option card gap, section tab gap                     |
| `--sp-4`   | 16px  | Internal card padding (sides), element spacing       |
| `--sp-5`   | 20px  | Card-to-navigation gap                               |
| `--sp-6`   | 24px  | Card internal padding (top/bottom), section spacing  |
| `--sp-8`   | 32px  | Main container padding, major section gaps           |
| `--sp-10`  | 40px  | Page-level vertical padding                          |

---

## 9. Responsive Breakpoints

| Breakpoint | Max Width   | Adjustments                                          |
|------------|-------------|------------------------------------------------------|
| Desktop    | 520px       | Fixed max-width for quiz content area                |
| Tablet     | ≤768px      | Container padding reduces to 24px 20px               |
| Mobile     | ≤480px      | Font sizes scale down 1–2px, pagination wraps        |
| Small      | ≤360px      | Stats row stacks vertically, option padding reduces  |

---

## 10. Accessibility Considerations

| Concern                  | Implementation                                             |
|--------------------------|------------------------------------------------------------|
| Colour contrast          | All text-on-background pairs meet WCAG AA (4.5:1 minimum) |
| Focus indicators         | Blue glow ring (`--primary-glow`) on all interactive elements |
| Motion sensitivity       | Wrap animations in `@media (prefers-reduced-motion: reduce)` — disable `float`, `bgShift`, stagger delays |
| Touch targets            | All interactive elements are minimum 44×44px               |
| Keyboard navigation      | Tab order follows visual flow; Enter/Space activates options |
| Screen readers           | `aria-label` on pagination dots; `role="option"` on answer cards; live region for score updates |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. CSS Custom Properties — Complete Reference

```css
:root {
  /* Canvas */
  --bg-base: #0B0F1A;
  --bg-gradient-from: #0D1225;
  --bg-gradient-to: #111827;
  --bg-surface: rgba(20, 28, 50, 0.65);
  --bg-elevated: rgba(30, 40, 65, 0.60);
  --bg-recessed: rgba(10, 15, 30, 0.50);

  /* Primary */
  --primary: #5B8DEF;
  --primary-glow: rgba(91, 141, 239, 0.25);
  --primary-clay: rgba(91, 141, 239, 0.30);
  --primary-muted: rgba(91, 141, 239, 0.15);

  /* Semantic */
  --correct: rgba(72, 199, 130, 0.35);
  --correct-solid: #48C782;
  --correct-glow: rgba(72, 199, 130, 0.20);
  --incorrect: rgba(235, 87, 87, 0.30);
  --incorrect-solid: #EB5757;
  --incorrect-glow: rgba(235, 87, 87, 0.18);
  --warning: rgba(245, 180, 60, 0.35);
  --warning-solid: #F5B43C;
  --info: rgba(130, 120, 210, 0.30);
  --info-solid: #8278D2;

  /* Text */
  --text-primary: #E8E4EF;
  --text-body: #C4BFD0;
  --text-muted: #8A8498;
  --text-dim: #5C576A;
  --text-inverse: #FFFFFF;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-focus: rgba(91, 141, 239, 0.40);
  --border-correct: rgba(72, 199, 130, 0.50);
  --border-incorrect: rgba(235, 87, 87, 0.50);

  /* Shadows */
  --clay-shadow: 6px 6px 14px rgba(0,0,0,0.55), -3px -3px 10px rgba(255,255,255,0.04), inset 2px 2px 4px rgba(255,255,255,0.07), inset -2px -2px 4px rgba(0,0,0,0.30);
  --clay-shadow-deep: 10px 10px 22px rgba(0,0,0,0.60), -5px -5px 14px rgba(255,255,255,0.05), inset 2px 2px 5px rgba(255,255,255,0.08), inset -2px -2px 5px rgba(0,0,0,0.35);
  --clay-shadow-hover: 8px 8px 18px rgba(0,0,0,0.60), -4px -4px 12px rgba(255,255,255,0.05), inset 2px 2px 5px rgba(255,255,255,0.08), inset -2px -2px 5px rgba(0,0,0,0.32);
  --clay-pressed: 3px 3px 6px rgba(0,0,0,0.45), inset 3px 3px 6px rgba(0,0,0,0.35), inset -2px -2px 4px rgba(255,255,255,0.05);
  --clay-inset: inset 2px 2px 5px rgba(0,0,0,0.35), inset -1px -1px 3px rgba(255,255,255,0.05);

  /* Radii */
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-base: 18px;
  --radius-lg: 24px;
  --radius-xl: 32px;

  /* Spacing */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 20px;
  --sp-6: 24px;
  --sp-8: 32px;
  --sp-10: 40px;

  /* Motion */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

---

## 12. Quick Reference — Screen-by-Screen Token Map

| Screen            | Background     | Card BG            | Shadow Used          | Primary Animation |
|-------------------|----------------|--------------------|----------------------|-------------------|
| Start / Login     | Radial gradient| `--bg-surface`     | `--clay-shadow-deep` | `fadeScale`       |
| Quiz / Question   | Radial gradient| `--bg-elevated`    | `--clay-shadow`      | `slideUp`         |
| Submit Modal      | Blur overlay   | `rgba(20,28,50,0.95)` | `--clay-shadow-deep` | `fadeScale`    |
| Results           | Radial gradient| `--bg-elevated`    | `--clay-shadow-deep` | `fadeScale`       |
| Answer Review     | Radial gradient| `--bg-elevated`    | `--clay-shadow`      | `slideUp` stagger |

---

*Document version 1.0 — April 2026*
*Design system for the "Mastering Claude for Developer Productivity" training programme*
*TM Systems Pvt. Ltd. — AI Strategy Division*
