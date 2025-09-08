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
 *   - 2: Low threshold for gentle filtering
 *   - 10: Medium threshold for deliberate scrolling
 *   - 25: High threshold for fast scrolling only
 * @param options.reserveSpace - Whether to reserve document flow space when sticky (default: true)
 *   - true: Traditional sticky behavior (sticky/relative positioning) - reserves space in document flow
 *   - false: Floating behavior (fixed/relative positioning) - no space reserved, element floats above content
 */
export function naturalStickyBottom(
  element: HTMLElement,
  options?: {
    snapEagerness?: number;
    scrollThreshold?: number;
    reserveSpace?: boolean;
  }
) {
  let lastScrollY = window.scrollY;
  let isSticky = false; // Start in relative/absolute mode
  let isFooterNotAtBottom = false; // Track if footer is NOT positioned at bottom of document
  const snapEagerness = options?.snapEagerness ?? 1; // Default to balanced behavior
  const scrollThreshold = options?.scrollThreshold ?? 0; // Default to always activate
  const reserveSpace = options?.reserveSpace ?? true; // Default to reserving space (sticky/relative)

  // Determine move positioning mode based on reserveSpace setting
  const movePosition = reserveSpace ? 'relative' : 'absolute';

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();
    const scrollStep = currentScrollY - lastScrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Extract element position coordinates once for efficiency
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;

    // Check if element has scrolled below viewport (only care about bottom edge for footers)
    const isElementHidden = elementTop >= viewportHeight;

    // Pre-calculate viewport bottom offset for positioning calculations
    // This represents distance from viewport bottom to document bottom
    const viewportBottomOffset =
      documentHeight - currentScrollY - viewportHeight;

    // Handle all move mode logic first (relative/absolute)
    if (!isSticky) {
      // First priority: Check if element should switch to sticky/fixed position
      // Predict where element bottom will be after next scroll to prevent visual gaps
      // If elementBottom - snapEagerness * scrollStep <= viewportHeight, element will reach viewport bottom
      if (elementBottom - snapEagerness * scrollStep <= viewportHeight) {
        // Element will reach viewport bottom on next scroll - make it sticky/fixed now
        isSticky = true;
        isFooterNotAtBottom = true; // Element is no longer at document bottom
        element.style.position = reserveSpace ? 'sticky' : 'fixed';
        element.style.bottom = '0';
      }
      // Second priority: If scrolling down fast enough and element is hidden, position below viewport
      else if (scrollStep >= scrollThreshold && isElementHidden) {
        // Reveal footer below viewport so it scrolls into view naturally
        isFooterNotAtBottom = true; // Element positioned below viewport, not at document bottom
        element.style.position = movePosition;
        // Position just below viewport: viewportBottomOffset - elementHeight
        // elementHeight = elementBottom - elementTop
        element.style.bottom = `${viewportBottomOffset - (elementBottom - elementTop)}px`;
      }
      // Third priority: When footer is hidden and not at document bottom, move it to document bottom
      // Prevents footer from being stuck in middle when user scrolls down slowly
      else if (isFooterNotAtBottom && isElementHidden) {
        // Move footer to document bottom for next reveal opportunity
        isFooterNotAtBottom = false; // Now positioned at document bottom
        element.style.position = movePosition;
        element.style.bottom = '0'; // Position at document bottom
      }
    }
    // Handle sticky/fixed mode logic - release when scrolling up
    else if (scrollStep < 0) {
      // Release from sticky/fixed position to allow natural hiding
      isSticky = false;
      element.style.position = movePosition;
      // Maintain visual continuity by positioning at current viewport bottom offset
      element.style.bottom = `${viewportBottomOffset}px`;
    }

    lastScrollY = currentScrollY;
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
