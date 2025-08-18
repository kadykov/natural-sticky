# Natural Sticky

A lightweight, framework-agnostic package for a natural hide-on-scroll effect.

This package provides a smooth, natural-feeling header that hides when scrolling down and reappears when scrolling up, without using JavaScript animations or thresholds.

[Live Demo](https://github.kadykov.com/natural-sticky/demo/)

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

**For a top-placed element (e.g., a header):**
```html
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.my-header');
    window.naturalStickyTop(header);
  });
</script>
```

**For a bottom-placed element (e.g., a footer):**
```html
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.my-footer');
    window.naturalStickyBottom(footer);
  });
</script>
```

### With a Bundler (e.g., Webpack, Vite)

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
