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
 */
export function naturalStickyBottom(
  element: HTMLElement,
  options?: { snapEagerness?: number }
) {
  let lastScrollY = window.scrollY;
  let isSticky = false; // Start in relative mode
  const snapEagerness = options?.snapEagerness ?? 1; // Default to balanced behavior

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();

    // Handle all relative mode logic first
    if (!isSticky) {
      // First priority: Check if element should switch to sticky
      // For bottom elements: predict where bottom edge will be on next scroll event
      // Formula: elementRect.bottom - snapEagerness * scrollStep <= window.innerHeight (where scrollStep = currentScrollY - lastScrollY)
      if (
        elementRect.bottom - snapEagerness * (currentScrollY - lastScrollY) <=
        window.innerHeight
      ) {
        // Element will be at bottom of viewport on next scroll event - make it sticky now
        isSticky = true;
        element.style.position = 'sticky';
        element.style.top = 'auto'; // Reset top positioning
        element.style.bottom = '0'; // Stick to bottom of viewport
      }
      // Second priority: If scrolling down and element is not visible, position below viewport
      // Check: scrolling down AND element not visible (bottom > 0 AND top < window height)
      else if (
        currentScrollY > lastScrollY &&
        !(elementRect.bottom > 0 && elementRect.top < window.innerHeight)
      ) {
        element.style.position = 'relative';

        // Calculate where we want the element to appear (just below the viewport)
        const targetPosition = currentScrollY + window.innerHeight;

        // Get the element's current offset and natural position in the document
        const currentTopOffset = parseFloat(element.style.top || '0');
        const naturalElementTop =
          elementRect.top + currentScrollY - currentTopOffset;

        // Calculate the offset needed to position element just below viewport
        const offset = targetPosition - naturalElementTop;
        element.style.top = `${offset}px`;
      }
    }
    // Handle sticky mode logic - release from sticky when scrolling up
    else if (currentScrollY < lastScrollY) {
      // Release from sticky when scrolling up
      isSticky = false;
      element.style.position = 'relative';

      // When releasing from sticky bottom position, we need to calculate where
      // the element should be positioned to maintain visual continuity.
      // The element is currently at the bottom of the viewport, so we calculate
      // its position relative to the document end to maintain that relationship.
      const currentDocumentPosition = elementRect.top + currentScrollY;

      // Reset any previous bottom styling since we're switching to top-based positioning
      element.style.bottom = '';

      // Calculate the offset from the element's natural position (at document end)
      // This ensures the element appears to stay in place when transitioning from sticky
      const targetOffset =
        currentDocumentPosition -
        (document.documentElement.scrollHeight - element.offsetHeight);

      element.style.top = `${targetOffset}px`;
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
