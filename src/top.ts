/**
 * Attaches a natural hide/show behavior to a sticky element placed at the top.
 *
 * This function creates a smooth, natural-feeling top element (like a header) that:
 * - Hides when scrolling down by naturally scrolling with the content
 * - Shows when scrolling up by positioning itself just above the viewport to scroll into view naturally
 * - Becomes sticky at the top when fully visible during upward scroll
 * - Releases from sticky position when scrolling down to allow natural hiding
 *
 * Key characteristics of the top implementation:
 * - Uses 'top' property for positioning in both modes
 * - When reserveSpace=true: sticky ↔ relative positioning (reserves document space)
 * - When reserveSpace=false: fixed ↔ absolute positioning (floating, no document space)
 * - When releasing from top position on scroll down, positions element at current scroll position
 * - When moving above viewport on scroll up, positions element just above viewport
 * - Transitions using scroll step prediction to avoid visual gaps (predicted elementRect.top >= 0)
 *
 * @param element - The HTML element to make naturally sticky
 * @param options - Configuration options
 * @param options.snapEagerness - How eagerly the element snaps into sticky position (default: 1)
 *   - 0: Pure natural movement, occasional visual gaps
 *   - 1: Balanced behavior (recommended)
 *   - 2-3: Reduced gaps, element "snaps" more eagerly to position
 *   - Higher: Strong snap effect, immediate attraction to edge
 * @param options.scrollThreshold - Minimum scroll speed (pixels/event) to trigger natural scroll-in effect (default: 0)
 *   - 0: Always activate scroll-in effect (current behavior)
 *   - 2: Low threshold for gentle filtering
 *   - 10: Medium threshold for deliberate scrolling
 *   - 25: High threshold for fast scrolling only
 * @param options.reserveSpace - Whether the element should reserve space in document flow (default: true)
 *   - true: Uses sticky ↔ relative positioning (normal headers/footers)
 *   - false: Uses fixed ↔ absolute positioning (floating buttons, multiple headers)
 */
export function naturalStickyTop(
  element: HTMLElement,
  options?: {
    snapEagerness?: number;
    scrollThreshold?: number;
    reserveSpace?: boolean;
  }
) {
  let lastScrollY = window.scrollY;
  let isSticky = false; // Start in relative/absolute mode
  let isHeaderNotAtTop = false; // Track if header is NOT positioned at top of document (top: 0px)
  const snapEagerness = options?.snapEagerness ?? 1; // Default to balanced behavior
  const scrollThreshold = options?.scrollThreshold ?? 0; // Default to always activate
  const reserveSpace = options?.reserveSpace ?? true; // Default to reserving space (sticky/relative)

  // Determine move positioning mode based on reserveSpace setting
  const movePosition = reserveSpace ? 'relative' : 'absolute';

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();
    const scrollStep = currentScrollY - lastScrollY;

    // Extract element position coordinates once for efficiency
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;

    // Check if element has scrolled above viewport (only care about top edge for headers)
    const isElementHidden = elementBottom <= 0;

    // Handle all move mode logic first (relative/absolute)
    if (!isSticky) {
      // First priority: Check if element should switch to top position (sticky/fixed)
      // Predict where element top will be after next scroll to prevent visual gaps
      // If elementTop - snapEagerness * scrollStep >= 0, element will be visible at viewport top
      if (elementTop - snapEagerness * scrollStep >= 0) {
        // Element will reach viewport top on next scroll - make it sticky/fixed now
        isSticky = true;
        isHeaderNotAtTop = true; // Element is no longer at document top
        element.style.position = reserveSpace ? 'sticky' : 'fixed';
        element.style.top = '0';
      }
      // Second priority: If scrolling up fast enough and element is hidden, position above viewport
      else if (-scrollStep >= scrollThreshold && isElementHidden) {
        // Reveal header above viewport so it scrolls into view naturally
        isHeaderNotAtTop = true; // Element positioned above viewport, not at document top
        element.style.position = movePosition;
        // Position just above viewport: currentScrollY - elementHeight
        // elementHeight = elementBottom - elementTop, so: currentScrollY - (elementBottom - elementTop)
        element.style.top = `${currentScrollY - elementBottom + elementTop}px`;
      }
      // Third priority: When header is hidden and not at document top, move it to document top
      // Prevents header from being stuck in middle when user scrolls up slowly
      else if (isHeaderNotAtTop && isElementHidden) {
        // Move header to document top for next reveal opportunity
        isHeaderNotAtTop = false; // Now positioned at document top
        element.style.position = movePosition;
        element.style.top = '0'; // Position at document top
      }
    }
    // Handle sticky/fixed mode logic - release when scrolling down
    else if (scrollStep > 0) {
      // Release from sticky/fixed position to allow natural hiding
      isSticky = false;
      element.style.position = movePosition;
      // Position at current scroll position so element moves naturally with content
      element.style.top = `${currentScrollY}px`;
    }

    lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
  };

  // Run once on load to set the initial state correctly.
  handleScroll();

  window.addEventListener('scroll', handleScroll, { passive: true });

  return {
    destroy: () => {
      window.removeEventListener('scroll', handleScroll);
    },
  };
}

// Export as default for UMD build
export default naturalStickyTop;
