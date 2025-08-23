# Natural Sticky

<div align="center">
  <img src="https://github.kadykov.com/natural-sticky/demo/header-1080p.webp" alt="Natural Sticky Header Demo" width="540" />
  <br>
  <em>Natural hide-on-scroll effect - the header moves naturally with your scroll speed</em>
</div>

[Live Demo](https://kadykov.github.io/natural-sticky/) | [Header CodePen Example](https://codepen.io/kadykov/pen/emprNoY) | [Footer CodePen Example](https://codepen.io/kadykov/pen/WbQJQjq)

[![npm version](https://badge.fury.io/js/natural-sticky.svg)](https://badge.fury.io/js/natural-sticky)
[![NPM Downloads](https://img.shields.io/npm/dw/natural-sticky)](https://badge.fury.io/js/natural-sticky)
[![License](https://img.shields.io/npm/l/natural-sticky)](https://opensource.org/licenses/MIT)

A lightweight, framework-agnostic package for natural hide-on-scroll effects.

**✨ Key Features:**

- **🚀 Ultra Lightweight:** Only 1.0KB minified (top), 1.2KB (bottom)
- **🚫 Zero Dependencies:** Pure TypeScript compiled to vanilla JavaScript
- **🎯 Natural Movement:** No jarring animations, just smooth natural scrolling
- **🔇 Less Distracting:** Movement syncs with your scroll speed - no sudden pop-ins or slide effects
- **⚡ Smart Prediction:** Uses scroll speed prediction to eliminate visual gaps during transitions
- **🎛️ Configurable Snap Behavior:** Fine-tune with snapEagerness parameter (0.0-3.0+) for different use cases
- **🔧 Framework Agnostic:** Works with React, Vue, Angular, or plain JavaScript

This package provides smooth, natural-feeling sticky elements that hide when scrolling down and reappear when scrolling up, without using JavaScript animations or scroll thresholds that can feel disconnected from user behavior.

## Why Choose Natural Sticky?

**Compared to alternatives:**

- **Natural Sticky:** 1.0-1.2KB, zero dependencies, natural movement, non-distracting, smart prediction
- **Headroom.js:** ~7KB, requires configuration, jarring slide animations
- **AOS (Animate On Scroll):** ~13KB, heavy animations, complex setup
- **Sticky-js:** ~4KB, basic functionality, disconnected from scroll behavior

**The difference is in the approach:** Instead of using CSS transitions or JavaScript animations that can feel disconnected from your scroll behavior, Natural Sticky lets the browser's native scrolling handle all movement. Elements flow naturally with your scroll speed, creating a seamless, unobtrusive experience that doesn't break user focus or create visual distractions.

## How it works

The core idea is to avoid any animation at all. Instead of changing the position and animating it, we just change to where the navigation bar is attached.

- When the navigation bar is attached to the screen viewport coordinates it always stays in the same position on the screen, and the user is allowed to freely scroll up the content while the navigation bar is visible and freely accessible to the user.
- But when the user scroll down or just only starting to scroll up, we use a relative position for the navigation bar so that it is attached to the content itself and scrolls naturally with the content.

As a result, there is no animation at all. The navigation bar hides and appears totally smooth naturally when the user scrolls up or scroll down.

## Installation

```bash
npm install natural-sticky
```

## Usage

This package provides two separate functions, one for top-placed elements and one for bottom-placed elements. You can use them as needed.

### In the Browser (via CDN)

Include the script for the function you need. You can use a service like jsDelivr.

**For a top-placed element (e.g., a header) - Only 1.0KB:**

```html
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.my-header');
    // Default balanced behavior
    window.naturalStickyTop(header);

    // Or customize snap behavior
    window.naturalStickyTop(header, { snapEagerness: 2.0 });
  });
</script>
```

**For a bottom-placed element (e.g., a footer) - Only 1.2KB:**

```html
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.my-footer');
    // Default balanced behavior
    window.naturalStickyBottom(footer);

    // Or customize snap behavior
    window.naturalStickyBottom(footer, { snapEagerness: 1.5 });
  });
</script>
```

### With a Bundler (e.g., Webpack, Vite) - Optimal Bundle Size

Import only the function you need to keep your bundle size minimal.

```javascript
import { naturalStickyTop, naturalStickyBottom } from 'natural-sticky';

const header = document.querySelector('.my-header');
if (header) {
  // Default balanced behavior (snapEagerness: 1.0)
  const headerInstance = naturalStickyTop(header);

  // Or customize snap behavior for different use cases
  const eagerHeader = naturalStickyTop(header, { snapEagerness: 2.0 }); // More gap prevention
  const naturalHeader = naturalStickyTop(header, { snapEagerness: 0.0 }); // Pure natural movement

  // To remove the event listeners later: headerInstance.destroy();
}

const footer = document.querySelector('.my-footer');
if (footer) {
  const footerInstance = naturalStickyBottom(footer, { snapEagerness: 1.5 });
  // To remove the event listeners later: footerInstance.destroy();
}
```

## CSS Requirements

For the scripts to work correctly, your sticky elements **must not have margins** that create gaps from their respective screen edges:

```css
.my-header {
  margin-top: 0; /* Required: Headers must align with top edge */
  /* margin-bottom, margin-left, margin-right can be preserved */
}

.my-footer {
  margin-bottom: 0; /* Required: Footers must align with bottom edge */
  /* margin-top, margin-left, margin-right can be preserved */
}
```

**Why specific margins break the scripts:**

- **Headers**: `margin-top` creates a gap from the top viewport edge, disrupting positioning calculations
- **Footers**: `margin-bottom` creates a gap from the bottom viewport edge, disrupting positioning calculations
- **Other margins**: `margin-left`, `margin-right`, and non-conflicting vertical margins can be preserved

**Elements that need margin reset:**

- Headings (`<h1>`, `<h2>`, etc.) - have default vertical margins like `margin: 21px 0`
- Paragraphs (`<p>`) - have default vertical margins
- Lists (`<ul>`, `<ol>`) - have default margins
- Any element with CSS margins applied to the problematic edges

**Elements that work without reset:**

- `<div>`, `<span>`, `<nav>`, `<section>` - have no default margins

### Minimal Working Example

```html
<!-- This works immediately (no default margins) -->
<div class="header">Header</div>

<!-- This needs specific margin reset -->
<h1 class="header" style="margin-top: 0;">
  Header with bottom spacing preserved
</h1>

<script>
  naturalStickyTop(document.querySelector('.header'));
</script>
```

## Fine-tuning with snapEagerness

The `snapEagerness` parameter allows you to balance between natural movement and visual gap prevention. It controls how aggressively the element anticipates scroll direction changes using scroll speed prediction.

### Parameter Values

- **`0.0`** - **Pure Natural Movement**
  - Most intuitive and natural feeling
  - Movement perfectly matches scroll speed
  - May show brief gaps during very fast scrolling
  - Best for content-focused sites and reading experiences

- **`1.0`** - **Balanced Behavior (Default)**
  - Sweet spot between natural movement and reliability
  - Predicts one scroll step ahead
  - Eliminates most visual gaps without feeling artificial
  - Recommended for most applications

- **`2.0`** - **Eager Gap Prevention**
  - More aggressive gap prevention
  - Predicts two scroll steps ahead
  - Virtually eliminates all visual gaps
  - Best for complex interfaces where gaps cause layout issues

- **`3.0+`** - **Magnetic Effect**
  - Creates intentional "magnetic" attraction to edges
  - Snapping becomes a deliberate design feature
  - Best for gaming interfaces or when snappy behavior is desired

### Usage Examples

```javascript
// Content-focused site - prioritize natural movement
naturalStickyTop(header, { snapEagerness: 0.0 });

// General purpose - balanced default behavior
naturalStickyTop(header); // Same as snapEagerness: 1.0

// Mobile-heavy app - prevent gaps during touch scrolling
naturalStickyTop(header, { snapEagerness: 2.0 });

// Gaming interface - intentional magnetic effect
naturalStickyTop(header, { snapEagerness: 3.0 });

// Custom fine-tuning
naturalStickyTop(header, { snapEagerness: 1.5 });
```

### How It Works

The prediction algorithm uses scroll velocity to anticipate where elements will be:

```
predictedPosition = currentPosition - snapEagerness × scrollVelocity
```

- **Higher values** = more anticipation = fewer gaps but less natural movement
- **Lower values** = less anticipation = more natural but occasional gaps
- **Custom values** (like 1.5, 2.7) allow precise tuning for specific use cases

### Live Comparisons

- **[4-Headers Live Comparison](https://kadykov.github.io/natural-sticky/demo/4-headers-comparison.html)** - All values side-by-side in real-time
- **[Individual Demos Comparison](https://kadykov.github.io/natural-sticky/demo/snap-comparison.html)** - Separate focused demos for each value

## Development

### Implementation Details

This package provides two separate implementations for top-placed and bottom-placed elements. While the core concept is the same, there are important differences in how positioning is calculated:

#### Top Implementation (`naturalStickyTop`)

- Uses `position: sticky` with `top: 0` when sticky
- When releasing on scroll down, positions element at current scroll position
- When moving above viewport on scroll up, positions element just above viewport (negative offset)
- **Smart transition timing**: Uses scroll speed prediction with configurable snapEagerness to eliminate visual gaps by switching to sticky before the element would become visible with a gap
- **snapEagerness parameter**: Controls prediction aggressiveness (default: 1.0)

#### Bottom Implementation (`naturalStickyBottom`)

- Uses `position: sticky` with `bottom: 0` when sticky
- When releasing on scroll up, calculates complex offset to maintain current document position
- When moving below viewport on scroll down, positions element just below viewport bottom
- **Smart transition timing**: Uses scroll speed prediction with configurable snapEagerness to determine optimal moment for switching to sticky positioning
- **snapEagerness parameter**: Controls prediction aggressiveness (default: 1.0)

The bottom implementation is more complex because:

1. **Bottom-anchored positioning**: Elements positioned relative to bottom behave differently than top-anchored elements
2. **Document flow calculations**: When switching from sticky to relative positioning, we must preserve the element's visual position in the document
3. **Natural position tracking**: We need to track where the element would naturally appear in the document flow vs. where it currently appears after applying offsets

### Scroll Speed Prediction with snapEagerness

Both implementations use intelligent scroll speed prediction with configurable eagerness to eliminate visual artifacts during transitions:

**The Problem**: Traditional implementations often show visual gaps when switching from relative to sticky positioning. For example, if a user scrolls up at 10 pixels per event and the element is at -1px, by the next frame it would be at +9px, creating a visible gap at the top.

**The Solution**: We predict where the element will be on the next scroll event using the formula with configurable snapEagerness:

- **Top elements**: `elementRect.top - snapEagerness * (currentScrollY - lastScrollY) >= 0`
- **Bottom elements**: `elementRect.bottom - snapEagerness * (currentScrollY - lastScrollY) <= window.innerHeight`

**How snapEagerness affects prediction**:

- `snapEagerness: 0.0` - No prediction, pure position-based transitions
- `snapEagerness: 1.0` - One scroll step prediction (default balanced behavior)
- `snapEagerness: 2.0` - Two scroll steps prediction (more aggressive)
- `snapEagerness: 3.0+` - Multi-step prediction (magnetic effect)

This allows us to switch to sticky positioning with the desired level of anticipation, ensuring seamless transitions that match your application's needs - from pure natural movement to completely gap-free behavior.

### Build and Test

- `npm install`: Install dependencies
- `npm run build`: Build the package
- `npm test`: Run tests (not yet implemented)
