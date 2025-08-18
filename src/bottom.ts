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
 * - Transitions to sticky when element's bottom edge reaches viewport bottom (elementRect.bottom <= window.innerHeight)
 * - More complex positioning calculations due to bottom-anchored nature and document height considerations
 */
export function naturalStickyBottom(element: HTMLElement) {
  let lastScrollY = window.scrollY;
  let mode = 'relative';

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const scrollingUp = currentScrollY < lastScrollY;
    const elementRect = element.getBoundingClientRect();
    const elementHeight = element.offsetHeight;
    const isElementVisible =
      elementRect.bottom > 0 && elementRect.top < window.innerHeight;

    // Scenario 1: Element is sticky at bottom and user scrolls up
    // Release the element from sticky position so it can scroll with content naturally
    if (mode === 'sticky' && scrollingUp) {
      mode = 'relative';
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
        (document.documentElement.scrollHeight - elementHeight);

      element.style.top = `${targetOffset}px`;
    }
    // Scenario 2: Element is in relative mode, user scrolls down, and element is not visible
    // Position the element just below the viewport so it can naturally scroll into view
    else if (mode === 'relative' && scrollingDown && !isElementVisible) {
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
    // Scenario 3: Element is in relative mode and has scrolled into view at bottom
    // Make it sticky so it stays at the bottom of the viewport
    else if (mode === 'relative' && elementRect.bottom <= window.innerHeight) {
      mode = 'sticky';
      element.style.position = 'sticky';
      element.style.top = 'auto'; // Reset top positioning
      element.style.bottom = '0'; // Stick to bottom of viewport
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
