/**
 * Attaches a natural hide/show behavior to a sticky element placed at the bottom.
 *
 * This function creates a smooth, natural-feeling bottom element (like a footer) that:
 * - Hides when scrolling up by naturally scrolling with the content
 * - Shows when scrolling down by positioning itself just below the viewport to scroll into view naturally
 * - Becomes sticky at the bottom when fully visible during downward scroll
 * - Releases from sticky position when scrolling up to allow natural hiding
 *
 * Key characteristics of the bottom implementation:
 * - Uses 'bottom' property for sticky positioning (unlike top which uses 'top')
 * - When releasing from sticky on scroll up, calculates position relative to document end
 * - When moving below viewport on scroll down, positions element just below viewport
 * - Transitions to sticky using scroll step prediction to avoid visual gaps (predicted elementRect.bottom <= window.innerHeight)
 * - More complex positioning calculations due to bottom-anchored nature and document height considerations
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
export function naturalStickyBottom(
  element: HTMLElement,
  options?: { snapEagerness?: number; scrollThreshold?: number }
) {
  let lastScrollY = window.scrollY;
  let isSticky = false; // Start in relative mode
  let isFooterAtBottom = true; // Track if footer is positioned at bottom of document
  const snapEagerness = options?.snapEagerness ?? 1; // Default to balanced behavior
  const scrollThreshold = options?.scrollThreshold ?? 0; // Default to always activate

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();
    const scrollStep = currentScrollY - lastScrollY;
    const viewportHeight = window.innerHeight;
    const isElementVisible =
      elementRect.bottom > 0 && elementRect.top < viewportHeight;
    const naturalFooterPosition =
      document.documentElement.scrollHeight - element.offsetHeight;

    // Handle all relative mode logic first
    if (!isSticky) {
      // First priority: Check if element should switch to sticky
      // For bottom elements: predict where bottom edge will be on next scroll event
      // Formula: elementRect.bottom - snapEagerness * scrollStep <= viewportHeight (where scrollStep = currentScrollY - lastScrollY)
      if (elementRect.bottom - snapEagerness * scrollStep <= viewportHeight) {
        // Element will be at bottom of viewport on next scroll event - make it sticky now
        isSticky = true;
        isFooterAtBottom = false; // Reset flag when becoming sticky
        element.style.position = 'sticky';
        element.style.top = 'auto'; // Reset top positioning
        element.style.bottom = '0'; // Stick to bottom of viewport
      }
      // Second priority: Check if scrolling down with enough speed to trigger scroll-in effect
      else if (scrollStep >= scrollThreshold && !isElementVisible) {
        // User is scrolling down with enough speed - reveal footer below viewport
        isFooterAtBottom = false; // Footer will be positioned below viewport, not at bottom
        element.style.position = 'relative';
        // Position element just below viewport so it scrolls into view naturally
        // Formula: offset = (currentScrollY + viewportHeight) - naturalFooterPosition
        // This calculates the distance from footer's natural position to desired position (below viewport)
        element.style.top = `${currentScrollY + viewportHeight - naturalFooterPosition}px`;
      }
      // Third priority: When footer becomes invisible, move it to bottom of document
      // This prevents the footer from being stuck in the middle when user scrolls down slowly
      else if (!isFooterAtBottom && !isElementVisible) {
        // Footer is not visible - move it to the bottom of the document
        isFooterAtBottom = true;
        element.style.position = 'relative';
        // Position at bottom of document (no offset needed, natural position)
        element.style.top = '0px';
      }
    }
    // Handle sticky mode logic - release from sticky when scrolling up
    else if (scrollStep < 0) {
      // Release from sticky when scrolling up
      isSticky = false;
      element.style.position = 'relative';
      // Reset any previous bottom styling since we're switching to top-based positioning
      element.style.bottom = '';

      // When releasing from sticky bottom position, maintain visual continuity
      // Formula: offset = (elementRect.top + currentScrollY) - naturalFooterPosition
      // This calculates offset from footer's natural position to keep it visually in the same place
      element.style.top = `${elementRect.top + currentScrollY - naturalFooterPosition}px`;
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
export default naturalStickyBottom;
