# Natural Sticky

<div align="center">
  <img src="demo/header-1080p.webp" alt="Natural Sticky Header Demo" width="540" />
  <br>
  <em>Natural hide-on-scroll effect - the header moves naturally with your scroll speed</em>
</div>

[Live Demo](https://kadykov.github.io/natural-sticky/)

[![npm version](https://badge.fury.io/js/natural-sticky.svg)](https://badge.fury.io/js/natural-sticky)
[![NPM Downloads](https://img.shields.io/npm/dw/natural-sticky)](https://badge.fury.io/js/natural-sticky)
[![License](https://img.shields.io/npm/l/natural-sticky)](https://opensource.org/licenses/MIT)

A lightweight, framework-agnostic package for natural hide-on-scroll effects.

**✨ Key Features:**

- **🚀 Ultra Lightweight:** Only 1.1KB minified (top), 1.3KB (bottom)
- **🚫 Zero Dependencies:** Pure TypeScript compiled to vanilla JavaScript
- **🎯 Natural Movement:** No jarring animations, just smooth natural scrolling
- **🔇 Less Distracting:** Movement syncs with your scroll speed - no sudden pop-ins or slide effects
- **🔧 Framework Agnostic:** Works with React, Vue, Angular, or plain JavaScript

This package provides smooth, natural-feeling sticky elements that hide when scrolling down and reappear when scrolling up, without using JavaScript animations or scroll thresholds that can feel disconnected from user behavior.

## Why Choose Natural Sticky?

**Compared to alternatives:**

- **Natural Sticky:** 1.1-1.3KB, zero dependencies, natural movement, non-distracting
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

**For a top-placed element (e.g., a header) - Only 1.1KB:**

```html
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.my-header');
    window.naturalStickyTop(header);
  });
</script>
```

**For a bottom-placed element (e.g., a footer) - Only 1.3KB:**

```html
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.my-footer');
    window.naturalStickyBottom(footer);
  });
</script>
```

### With a Bundler (e.g., Webpack, Vite) - Optimal Bundle Size

Import only the function you need to keep your bundle size minimal.

```javascript
import { naturalStickyTop, naturalStickyBottom } from 'natural-sticky';

const header = document.querySelector('.my-header');
if (header) {
  const headerInstance = naturalStickyTop(header);
  // To remove the event listeners later: headerInstance.destroy();
}

const footer = document.querySelector('.my-footer');
if (footer) {
  const footerInstance = naturalStickyBottom(footer);
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

## Development

### Implementation Details

This package provides two separate implementations for top-placed and bottom-placed elements. While the core concept is the same, there are important differences in how positioning is calculated:

#### Top Implementation (`naturalStickyTop`)

- Uses `position: sticky` with `top: 0` when sticky
- When releasing on scroll down, positions element at current scroll position
- When moving above viewport on scroll up, positions element just above viewport (negative offset)
- Transitions to sticky when element's top edge reaches viewport top

#### Bottom Implementation (`naturalStickyBottom`)

- Uses `position: sticky` with `bottom: 0` when sticky
- When releasing on scroll up, calculates complex offset to maintain current document position
- When moving below viewport on scroll down, positions element just below viewport bottom
- Transitions to sticky when element's bottom edge is fully within viewport

The bottom implementation is more complex because:

1. **Bottom-anchored positioning**: Elements positioned relative to bottom behave differently than top-anchored elements
2. **Document flow calculations**: When switching from sticky to relative positioning, we must preserve the element's visual position in the document
3. **Natural position tracking**: We need to track where the element would naturally appear in the document flow vs. where it currently appears after applying offsets

### Build and Test

- `npm install`: Install dependencies
- `npm run build`: Build the package
- `npm test`: Run tests (not yet implemented)
