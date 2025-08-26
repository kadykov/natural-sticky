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
 * - Uses 'top' property for both sticky and relative positioning
 * - When releasing from sticky on scroll down, positions element at current scroll position
 * - When moving above viewport on scroll up, positions element just above viewport (negative offset)
 * - Transitions to sticky using scroll step prediction to avoid visual gaps (predicted elementRect.top >= 0)
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
 *   - 5-15: Activate only on medium-speed scrolling
 *   - 20+: Activate only on fast scrolling
 */
export function naturalStickyTop(
  element: HTMLElement,
  options?: { snapEagerness?: number; scrollThreshold?: number }
) {
  let lastScrollY = window.scrollY;
  let isSticky = false; // Start in relative mode
  let isHeaderAtTop = true; // Track if header is positioned at top of document (top: 0px)
  const snapEagerness = options?.snapEagerness ?? 1; // Default to balanced behavior
  const scrollThreshold = options?.scrollThreshold ?? 0; // Default to always activate

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();
    const scrollStep = currentScrollY - lastScrollY;
    const isElementVisible =
      elementRect.bottom > 0 && elementRect.top < window.innerHeight;

    // Handle all relative mode logic first
    if (!isSticky) {
      // First priority: Check if element should switch to sticky
      // Predict where element will be on next scroll event to avoid visual gaps
      // Formula: elementRect.top - snapEagerness * scrollStep >= 0 (where scrollStep = currentScrollY - lastScrollY)
      if (elementRect.top - snapEagerness * scrollStep >= 0) {
        // Element will be visible at top on next scroll event - make it sticky now
        isSticky = true;
        isHeaderAtTop = false; // Reset flag when becoming sticky
        element.style.position = 'sticky';
        element.style.top = '0';
      }
      // Second priority: If scrolling up with sufficient speed and element is not visible, position above viewport
      else if (-scrollStep >= scrollThreshold && !isElementVisible) {
        // User is scrolling up with enough speed - reveal header above viewport
        isHeaderAtTop = false; // Header will be positioned above viewport, not at top
        element.style.position = 'relative';
        // Position element just above viewport so it scrolls into view naturally
        element.style.top = `${currentScrollY - element.offsetHeight}px`;
      }
      // Third priority: When header becomes invisible, move it to top of page
      // This prevents the header from being stuck in the middle when user scrolls up slowly
      else if (!isHeaderAtTop && !isElementVisible) {
        // Header is not visible - move it to the top of the page
        isHeaderAtTop = true;
        element.style.position = 'relative';
        element.style.top = '0px'; // Position at top of document
      }
    }
    // Handle sticky mode logic - release from sticky when scrolling down
    else if (scrollStep > 0) {
      // Release from sticky when scrolling down
      isSticky = false;
      element.style.position = 'relative';
      // Position element at current scroll position so it moves naturally with content
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
