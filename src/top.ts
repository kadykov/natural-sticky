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
 * The script dispatches a `natural-sticky` event with the following states in `event.detail.state`:
 * - 'sticky': The element is stuck to the top of the viewport.
 * - 'home': The element is at its original position at the top of the document.
 * - 'relative': The element is scrolling with the page content.
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

  const setPositionAndTop = (position: string, top: string) => {
    element.style.position = position;
    element.style.top = top;
  };

  // Function to update state and dispatch event if changed
  const setState = (newState: StickyState) => {
    if (currentState !== newState) {
      currentState = newState;
      element.dispatchEvent(
        new CustomEvent('natural-sticky', {
          detail: { state: currentState },
        })
      );
    }
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();
    const scrollStep = currentScrollY - lastScrollY;

    // Extract element position coordinates once for efficiency
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;
    const isElementHidden = elementBottom <= 0;

    // Priority 1: Handle all cases that should result in the 'home' state.
    if (
      currentScrollY <= 0 ||
      (isElementHidden && currentState === STATE_RELATIVE)
    ) {
      setPositionAndTop(movePosition, '0');
      setState(STATE_HOME);
    }
    // Priority 2: Handle scrolling UP logic.
    else if (scrollStep < 0) {
      // First, check if it should become sticky. This is prioritized to prevent visual gaps.
      if (
        elementTop - snapEagerness * scrollStep >= 0 &&
        currentState === STATE_RELATIVE
      ) {
        setPositionAndTop(reserveSpace ? STATE_STICKY : 'fixed', '0');
        setState(STATE_STICKY);
      }
      // If not becoming sticky, check if we need to release it above the viewport.
      else if (-scrollStep >= scrollThreshold && isElementHidden) {
        setPositionAndTop(
          movePosition,
          `${currentScrollY - elementBottom + elementTop}px`
        );
        setState(STATE_RELATIVE);
      }
    }
    // Priority 3: Handle scrolling DOWN logic.
    else if (scrollStep > 0 && currentState === STATE_STICKY) {
      setPositionAndTop(movePosition, `${currentScrollY}px`);
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
export default naturalStickyTop;
