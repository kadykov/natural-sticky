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
  // Define constants for states to improve minification
  const STATE_STICKY = 'sticky';
  const STATE_HOME = 'home';
  const STATE_RELATIVE = 'relative';

  // Define the possible states for the element
  type StickyState =
    | typeof STATE_STICKY
    | typeof STATE_HOME
    | typeof STATE_RELATIVE;

  let lastScrollY = window.scrollY;
  let currentState: StickyState = STATE_HOME; // Initial state
  const snapEagerness = options?.snapEagerness ?? 1; // Default to balanced behavior
  const scrollThreshold = options?.scrollThreshold ?? 0; // Default to always activate
  const reserveSpace = options?.reserveSpace ?? true; // Default to reserving space (sticky/relative)

  // Determine move positioning mode based on reserveSpace setting
  const movePosition = reserveSpace ? STATE_RELATIVE : 'absolute';

  // Function to update state and dispatch event if changed
  const setState = (newState: StickyState) => {
    if (currentState !== newState) {
      currentState = newState;
      element.dispatchEvent(
        new CustomEvent('natural-sticky', {
          detail: currentState,
        })
      );
    }
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();
    const scrollStep = currentScrollY - lastScrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Extract element position coordinates once for efficiency
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;
    const isElementHidden = elementTop >= viewportHeight;

    // Pre-calculate viewport bottom offset for positioning calculations
    const viewportBottomOffset =
      documentHeight - currentScrollY - viewportHeight;

    // Priority 1: Handle all cases that should result in the 'home' state.
    // The check for reaching the document bottom includes a 1px tolerance. This is to prevent issues
    // where browser floating-point inaccuracies in height/scroll calculations can result in a value
    // like `total_scroll_height - 0.0000000001`, which would fail a strict equality check.
    if (
      currentScrollY + viewportHeight >= documentHeight - 1 ||
      (isElementHidden && currentState === STATE_RELATIVE)
    ) {
      element.style.position = movePosition;
      element.style.bottom = '0';
      setState(STATE_HOME);
    }
    // Priority 2: Handle scrolling DOWN logic.
    else if (scrollStep > 0) {
      // First, check if it should become sticky. This is prioritized to prevent visual gaps.
      if (
        elementBottom - snapEagerness * scrollStep <= viewportHeight &&
        currentState === STATE_RELATIVE
      ) {
        element.style.position = reserveSpace ? STATE_STICKY : 'fixed';
        element.style.bottom = '0';
        setState(STATE_STICKY);
      }
      // If not becoming sticky, check if we need to release it below the viewport.
      else if (scrollStep >= scrollThreshold && isElementHidden) {
        element.style.position = movePosition;
        element.style.bottom = `${
          viewportBottomOffset - (elementBottom - elementTop)
        }px`;
        setState(STATE_RELATIVE);
      }
    }
    // Priority 3: Handle scrolling UP logic.
    else if (scrollStep < 0 && currentState === STATE_STICKY) {
      element.style.position = movePosition;
      element.style.bottom = `${viewportBottomOffset}px`;
      setState(STATE_RELATIVE);
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
