# Natural Sticky

<div align="center">
  <img src="https://github.kadykov.com/natural-sticky/demo/header-1080p.webp" alt="Natural Sticky Header Demo" width="540" />
  <br>
  <em>Natural hide-on-scroll effect - the header moves naturally with your scroll speed</em>
</div>

[Live Demo](https://github.kadykov.com/natural-sticky/) | [CodePen Examples](https://codepen.io/collection/YwWpVY)

[![License](https://img.shields.io/npm/l/natural-sticky)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/natural-sticky.svg)](https://badge.fury.io/js/natural-sticky)
[![NPM Downloads](https://img.shields.io/npm/dw/natural-sticky)](https://badge.fury.io/js/natural-sticky)
[![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/natural-sticky)](https://www.jsdelivr.com/package/npm/natural-sticky)

[![Minified Size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js)](https://cdn.jsdelivr.net/npm/natural-sticky/dist/)
[![Gzip Size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js?compression=gzip)](https://cdn.jsdelivr.net/npm/natural-sticky/dist/)
[![Brotli Size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js?compression=brotli)](https://cdn.jsdelivr.net/npm/natural-sticky/dist/) - [natural-sticky.top.min.js](https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js)

[![Minified Size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js)](https://cdn.jsdelivr.net/npm/natural-sticky/dist/)
[![Gzip Size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js?compression=gzip)](https://cdn.jsdelivr.net/npm/natural-sticky/dist/)
[![Brotli Size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js?compression=brotli)](https://cdn.jsdelivr.net/npm/natural-sticky/dist/) - [natural-sticky.bottom.min.js](https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js)

A lightweight, framework-agnostic package for natural hide-on-scroll effects.

## Why Natural Sticky?

**The problem with existing solutions:** Most sticky header libraries use CSS animations or JavaScript tweening that feel disconnected from your actual scroll behavior. They slide, fade, or pop in/out with predetermined timing that can feel jarring or distracting.

**Our approach:** No animations at all. Instead, we smartly switch between positioning modes (`sticky`/`relative` for traditional behavior, `fixed`/`absolute` for floating elements), letting the browser's native scrolling handle all movement. Headers and footers flow naturally with your scroll speed - hide naturally when scrolling down, reappear naturally when scrolling up. The floating mode enables multiple elements on the same page without document flow conflicts.

**Key Benefits:**

- **🎈 Ultra Lightweight:** 1.2KB (header) / 1.3KB (footer) - no dependencies
- **🌊 Natural Movement:** Flows with your scroll speed, no artificial animations or distracting effects
- **🤹 Multiple Elements:** Animate multiple headers, footers, and floating elements without conflicts
- **🎪 Event-Driven:** Listen to state changes and create dynamic, responsive interfaces
- **♟️ Smart Positioning:** Predictive gap elimination and flexible document flow control
- **🎛️ Fine-tunable:** Three parameters control natural feel, activation, and positioning mode

**Compared to alternatives:**

- **Headroom.js:** ~4.6KB, slide animations, requires configuration
- **AOS:** ~14.2KB, complex animations, heavy setup
- **Natural Sticky:** 1.2-1.3KB, zero dependencies, natural movement that doesn't break focus

## Quick Start

### Installation & CDN

Choose your preferred method:

**Option 1: NPM Package**

```bash
npm install natural-sticky
```

```javascript
import { naturalStickyTop, naturalStickyBottom } from 'natural-sticky';

// Headers
const headerInstance = naturalStickyTop(document.querySelector('.header'));

// Footers
const footerInstance = naturalStickyBottom(document.querySelector('.footer'));

// Clean up when needed
headerInstance.destroy();
footerInstance.destroy();
```

**Option 2: CDN (Browser)**

```html
<!-- For headers (1.2KB) -->
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js"></script>
<script>
  const header = document.querySelector('.header');
  window.naturalStickyTop(header);
</script>

<!-- For footers (1.3KB) -->
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js"></script>
<script>
  const footer = document.querySelector('.footer');
  window.naturalStickyBottom(footer);
</script>
```

### Framework Integration

Works seamlessly with any framework:

```javascript
// React
useEffect(() => {
  const instance = naturalStickyTop(headerRef.current);
  return () => instance.destroy();
}, []);

// Vue
mounted() {
  this.headerInstance = naturalStickyTop(this.$refs.header);
},
beforeDestroy() {
  this.headerInstance.destroy();
}

// Angular
ngAfterViewInit() {
  this.headerInstance = naturalStickyTop(this.headerElement.nativeElement);
}
ngOnDestroy() {
  this.headerInstance.destroy();
}
```

**Most use cases require no additional configuration.** For specific requirements or advanced features, see [CSS Requirements](#css-requirements), [Configuration](#configuration), or [Events](#events) below.

## How It Works

Natural Sticky uses a three-state finite state machine to create fluid, natural-feeling sticky behavior without animations.

```mermaid
stateDiagram-v2
    [*] --> home : Page loads
    home --> relative : Scroll down
    relative --> sticky : Scroll up to viewport edge
    sticky --> relative : Scroll down
    relative --> home : Scroll off-screen or reach top
    sticky --> home : Scroll to very top (scrollY ≤ 0)
```

**State Overview:**

- **`home`** - Element at natural document position (page top or scrolled off-screen)
- **`sticky`** - Element locked to viewport edge (traditional sticky behavior)
- **`relative`** - Element transitioning with scroll (natural movement phase)

The core insight: avoid animations entirely. Instead, we smartly switch between positioning modes at exactly the right moments, letting the browser's native scrolling handle all movement.

**Live Demo:** [How It Works](https://github.kadykov.com/natural-sticky/demo/basic-how-it-works.html) - Deep dive into the three-state system

## Events

Natural Sticky dispatches events when elements change state, enabling dynamic interfaces that respond to scroll behavior:

```javascript
const header = document.querySelector('.header');
naturalStickyTop(header);

// Listen for state changes
header.addEventListener('natural-sticky', event => {
  const currentState = event.detail.state; // 'home', 'sticky', or 'relative'

  // Apply different styles based on state
  header.classList.remove('state-home', 'state-sticky', 'state-relative');
  header.classList.add(`state-${currentState}`);

  console.log(`Header is now: ${currentState}`);
});
```

**Live Demo:** [Event System Demo](https://github.kadykov.com/natural-sticky/demo/basic-events.html) - Interactive event system showcase

## Configuration

For most use cases, the defaults work perfectly. However, you can fine-tune the behavior:

```javascript
naturalStickyTop(header, {
  reserveSpace: true, // Document flow: true (traditional) or false (floating)
  snapEagerness: 1.0, // Gap prevention: 0.0 (natural) to 3.0+ (magnetic)
  scrollThreshold: 0, // Activation threshold: 0 (always) to 30+ (fast scroll only)
});
```

### reserveSpace - Positioning Mode

Controls whether the element reserves space in document flow:

- **`true`** - Traditional sticky behavior (sticky ↔ relative positioning)
- **`false`** - Floating elements (fixed ↔ absolute positioning)

**Key capability: Multiple elements on the same page.** Floating mode allows you to animate multiple headers, footers, floating action buttons, notifications, and status indicators simultaneously without document flow conflicts.

**Use floating elements for:**

- Multiple headers/footers without layout conflicts
- Floating action buttons, notifications, or status indicators
- Overlay elements that shouldn't affect content flow

**Live Demo:**

- [Mixed Positioning Demo](https://github.kadykov.com/natural-sticky/demo/basic-floating-elements.html) - Traditional sticky vs floating elements

### snapEagerness - Tuning Natural vs Gap-Free

Controls how aggressively the element anticipates scroll direction changes:

- **`0.0`** - Pure natural movement (occasional gaps during very fast scrolling)
- **`1.0`** - Balanced default (recommended for most cases)
- **`2.0+`** - Aggressive gap prevention (more predictive, less natural)

**Live Demos:**

- [4-Headers SnapEagerness](https://github.kadykov.com/natural-sticky/demo/multi-header-snap.html) - Live side-by-side comparison
- [SnapEagerness Demos](https://github.kadykov.com/natural-sticky/demo/comparison-snap.html) - Individual iframe comparisons

### scrollThreshold - Controlling Activation

Controls when the scroll-in effect activates based on scroll speed:

- **`0`** - Always activate (default, most responsive)
- **`5-15`** - Moderate threshold (deliberate scrolling required)
- **`20+`** - High threshold (fast scrolling only)

**Live Demos:**

- [4-Headers ScrollThreshold](https://github.kadykov.com/natural-sticky/demo/multi-header-threshold.html) - Live side-by-side comparison
- [ScrollThreshold Demos](https://github.kadykov.com/natural-sticky/demo/comparison-threshold.html) - Individual iframe comparisons

## CSS Requirements

### Traditional Sticky Elements (reserveSpace: true)

Elements must align with their respective screen edges:

```css
.header {
  margin-top: 0; /* Required: must align with top edge */
  /* Other margins preserved: margin-bottom, margin-left, margin-right */
}

.footer {
  margin-bottom: 0; /* Required: must align with bottom edge */
  /* Other margins preserved: margin-top, margin-left, margin-right */
}
```

### Floating Elements (reserveSpace: false)

For floating elements that don't affect document flow:

```css
/* Required for bottom script with floating elements */
body {
  position: relative;
}

/* Required for floating bottom elements - proper initialization */
.floating-bottom-container {
  position: absolute; /* Required for proper initialization */
  bottom: 0; /* Required for proper initialization */
}
```

**Why body positioning:** Bottom script uses absolute positioning with bottom coordinates. Without `body { position: relative; }`, coordinates calculate from viewport bottom instead of document bottom.

**Why floating bottom element positioning:** Without proper CSS positioning, the bottom script cannot determine the element's initial location, causing it to render incorrectly until the user scrolls to the very bottom of the page.

**Optional: Adding gaps from viewport edges**

By default, floating elements align flush with viewport edges. To add spacing, wrap elements in containers:

```css
/* Example: Adding 20px gap from edges */
.floating-header-container {
  padding-top: 20px; /* Distance from top (for top script) */
}

.floating-footer-container {
  padding-bottom: 20px; /* Distance from bottom (for bottom script) */
}
```

```javascript
// Apply Natural Sticky to containers, not inner elements
naturalStickyTop(document.querySelector('.floating-header-container'), {
  reserveSpace: false,
});
```

**Why containers:** Containers position at `top: 0px` or `bottom: 0px` when sticky, while padding controls the actual element placement inside the container.
