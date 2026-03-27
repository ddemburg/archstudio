# ArchStudio — 2026 UI/UX Branding Standards

## Design Philosophy
Modern architectural office software. Professional, minimal, precise — like the work itself.
Every pixel should feel intentional. No decorative clutter.

---

## Color Palette — Steel & Gold

### Primary (Steel)
```
--color-steel-900: #0f1318   /* deepest background */
--color-steel-800: #1a2030   /* card/panel background */
--color-steel-700: #232b3e   /* elevated surface */
--color-steel-600: #2e3a52   /* border, divider */
--color-steel-500: #4a5a78   /* muted text, icons */
--color-steel-400: #7a8fb0   /* secondary text */
--color-steel-300: #b0bdd4   /* primary text on dark */
--color-steel-200: #d4dbe8   /* strong text on dark */
--color-steel-100: #eef1f7   /* headings on dark */
```

### Accent (Gold)
```
--color-gold-600: #7a5c1e   /* hover state */
--color-gold-500: #a67c2e   /* active state */
--color-gold-400: #c9983a   /* primary accent */
--color-gold-300: #e0b255   /* hover highlight */
--color-gold-200: #f0cc7a   /* bright accent */
--color-gold-100: #fde8a8   /* subtle glow */
```

### Semantic
```
--color-success: #3d8f5f
--color-warning: #b8822a
--color-error:   #8f3d3d
--color-info:    #3d668f
```

---

## Glassmorphism System

### Glass Card (standard)
```css
background: rgba(26, 32, 48, 0.75);
backdrop-filter: blur(12px) saturate(1.4);
-webkit-backdrop-filter: blur(12px) saturate(1.4);
border: 1px solid rgba(160, 180, 220, 0.12);
border-radius: 12px;
box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04) inset;
```

### Glass Card (elevated — modals, dropdowns)
```css
background: rgba(35, 43, 62, 0.88);
backdrop-filter: blur(20px) saturate(1.6);
border: 1px solid rgba(160, 180, 220, 0.18);
border-radius: 16px;
box-shadow: 0 8px 48px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset;
```

### Glass Button (primary)
```css
background: linear-gradient(135deg, rgba(201,152,58,0.25), rgba(201,152,58,0.12));
backdrop-filter: blur(8px);
border: 1px solid rgba(201,152,58,0.45);
border-radius: 8px;
color: #e0b255;
transition: all 0.2s ease;
```

### Glass Button (hover)
```css
background: linear-gradient(135deg, rgba(201,152,58,0.38), rgba(201,152,58,0.22));
border-color: rgba(201,152,58,0.7);
box-shadow: 0 0 16px rgba(201,152,58,0.2);
```

---

## Fluid Typography

Use `clamp()` for all font sizes. Base unit: 16px (1rem).

```css
/* Scale */
--text-xs:   clamp(0.65rem,  0.6rem + 0.25vw,  0.75rem);
--text-sm:   clamp(0.78rem,  0.72rem + 0.3vw,  0.875rem);
--text-base: clamp(0.9rem,   0.85rem + 0.35vw, 1rem);
--text-md:   clamp(1rem,     0.95rem + 0.4vw,  1.125rem);
--text-lg:   clamp(1.1rem,   1rem + 0.5vw,     1.25rem);
--text-xl:   clamp(1.2rem,   1.1rem + 0.65vw,  1.5rem);
--text-2xl:  clamp(1.4rem,   1.25rem + 0.85vw, 1.875rem);
--text-3xl:  clamp(1.65rem,  1.4rem + 1.1vw,   2.25rem);

/* Line heights */
--leading-tight:  1.2;
--leading-normal: 1.5;
--leading-loose:  1.75;

/* Letter spacing */
--tracking-tight:  -0.02em;
--tracking-normal:  0;
--tracking-wide:   0.04em;
--tracking-wider:  0.08em;  /* use for labels, badges */
```

### Font Stack
```css
font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
/* For numeric data (project IDs, dates, counts): */
font-variant-numeric: tabular-nums;
```

---

## Spacing & Layout

```css
/* Spacing scale */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;

/* Border radius */
--radius-sm:  6px;
--radius-md:  10px;
--radius-lg:  14px;
--radius-xl:  20px;
--radius-full: 9999px;
```

---

## Animation

```css
/* Transitions */
--transition-fast:   0.12s ease;
--transition-normal: 0.2s ease;
--transition-slow:   0.35s cubic-bezier(0.4, 0, 0.2, 1);

/* Micro-interaction: appear */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-appear { animation: fadeSlideUp 0.2s ease forwards; }
```

---

## Component Patterns

### Sidebar Navigation Item
- Inactive: steel-400 text, transparent background
- Hover: steel-200 text, glass card background
- Active: gold-300 text, gold glass background + left border gold-400

### Status Badges
- To Do:       steel-500 bg, steel-300 text
- In Progress: info bg, info-light text
- Done:        success bg, success-light text
- Blocked:     error bg, error-light text

### Hebrew RTL
All layouts must support `dir="rtl"`. Use `margin-inline-start/end` instead of `margin-left/right`. Sidebar on the right in RTL mode.

---

## What to Upgrade (Priority Order)

1. **Cards & panels** — apply glass backgrounds (currently flat/opaque)
2. **Buttons** — gold glass style for primary actions
3. **Sidebar** — dark steel base with glass active state
4. **Modals** — elevated glass card
5. **Typography** — fluid clamp() sizes
6. **Status badges** — semantic colors with glass tint
7. **Inputs & dropdowns** — glass background, gold focus ring

---

*Version: 2026.1 — ArchStudio internal standards*
