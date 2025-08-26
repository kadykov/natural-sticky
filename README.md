# Natural Sticky

<div align="center">
  <img src="https://github.kadykov.com/natural-sticky/demo/header-1080p.webp" alt="Natural Sticky Header Demo" width="540" />
  <br>
  <em>Natural hide-on-scroll effect - the header moves naturally with your scroll speed</em>
</div>

[Live Demo](https://github.kadykov.com/natural-sticky/) | [Header CodePen](https://codepen.io/kadykov/pen/emprNoY) | [Footer CodePen](https://codepen.io/kadykov/pen/WbQJQjq)

[![npm version](https://badge.fury.io/js/natural-sticky.svg)](https://badge.fury.io/js/natural-sticky)
[![NPM Downloads](https://img.shields.io/npm/dw/natural-sticky)](https://badge.fury.io/js/natural-sticky)
[![License](https://img.shields.io/npm/l/natural-sticky)](https://opensource.org/licenses/MIT)

A lightweight, framework-agnostic package for natural hide-on-scroll effects.

## Why Natural Sticky?

**The problem with existing solutions:** Most sticky header libraries use CSS animations or JavaScript tweening that feel disconnected from your actual scroll behavior. They slide, fade, or pop in/out with predetermined timing that can feel jarring or distracting.

**Our approach:** No animations at all. Instead, we smartly switch between `sticky` and `relative` positioning, letting the browser's native scrolling handle all movement. Headers and footers flow naturally with your scroll speed - hide naturally when scrolling down, reappear naturally when scrolling up.

**Key Benefits:**

- **🚀 Ultra Lightweight:** 1.0KB (header) / 1.2KB (footer) - no dependencies
- **🎯 Natural Movement:** Flows with your scroll speed, no artificial animations
- **🔇 Non-Distracting:** Movement feels like part of the content, not a separate UI behavior
- **⚡ Gap-Free Transitions:** Smart prediction eliminates visual gaps during direction changes
- **🎛️ Fine-tunable:** Optional parameters for different use cases and preferences

**Compared to alternatives:**

- **Headroom.js:** ~7KB, slide animations, requires configuration
- **AOS:** ~13KB, complex animations, heavy setup
- **Natural Sticky:** 1.0-1.2KB, zero dependencies, natural movement that doesn't break focus

## Installation

```bash
npm install natural-sticky
```

## Quick Start

### Browser (CDN)

```html
<!-- For headers (1.0KB) -->
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.top.min.js"></script>
<script>
  const header = document.querySelector('.header');
  window.naturalStickyTop(header);
</script>

<!-- For footers (1.2KB) -->
<script src="https://cdn.jsdelivr.net/npm/natural-sticky/dist/natural-sticky.bottom.min.js"></script>
<script>
  const footer = document.querySelector('.footer');
  window.naturalStickyBottom(footer);
</script>
```

### Module Bundlers

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

## CSS Requirements

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

**Why:** Default margins on headings (`<h1>`, `<h2>`) or paragraphs (`<p>`) create gaps that disrupt positioning calculations.

## Advanced Configuration

For most use cases, the defaults work perfectly. However, you can fine-tune the behavior:

```javascript
naturalStickyTop(header, {
  snapEagerness: 1.0, // Gap prevention: 0.0 (natural) to 3.0+ (magnetic)
  scrollThreshold: 0, // Activation threshold: 0 (always) to 30+ (fast scroll only)
});
```

### snapEagerness - Tuning Natural vs Gap-Free

Controls how aggressively the element anticipates scroll direction changes:

- **`0.0`** - Pure natural movement (occasional gaps during very fast scrolling)
- **`1.0`** - Balanced default (recommended for most cases)
- **`2.0+`** - Aggressive gap prevention (more predictive, less natural)

### scrollThreshold - Controlling Activation

Controls when the scroll-in effect activates based on scroll speed:

- **`0`** - Always activate (default, most responsive)
- **`5-15`** - Moderate threshold (deliberate scrolling required)
- **`20+`** - High threshold (fast scrolling only)

### Live Comparisons

- [4-Headers SnapEagerness](https://github.kadykov.com/natural-sticky/demo/4-headers-comparison.html) - Live side-by-side comparison
- [SnapEagerness Demos](https://github.kadykov.com/natural-sticky/demo/snap-comparison.html) - Individual iframe comparisons
- [4-Headers ScrollThreshold](https://github.kadykov.com/natural-sticky/demo/4-headers-scroll-threshold-comparison.html) - Live side-by-side comparison
- [ScrollThreshold Demos](https://github.kadykov.com/natural-sticky/demo/scroll-threshold-demo.html) - Individual iframe comparisons

## How It Works

The core insight: avoid animations entirely.

1. **When visible and user scrolls down:** Switch to `relative` positioning so the element scrolls naturally with content
2. **When user scrolls up:** Position the element just above/below the viewport so it scrolls into view naturally
3. **When element reaches viewport edge:** Switch to `sticky` positioning to keep it visible

The magic is in the timing - we use scroll speed prediction to switch between positioning modes at exactly the right moment, eliminating visual gaps without artificial animations.

## Framework Integration

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
