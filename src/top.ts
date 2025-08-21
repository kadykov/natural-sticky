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
 * - Transitions to sticky using scroll speed prediction to avoid visual gaps (predicted elementRect.top >= 0)
 */
export function naturalStickyTop(element: HTMLElement) {
  let lastScrollY = window.scrollY;
  let isSticky = false; // Start in relative mode

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();

    // Handle all relative mode logic first
    if (!isSticky) {
      // First priority: Check if element should switch to sticky
      // Predict where element will be on next scroll event to avoid visual gaps
      // Formula: elementRect.top - scrollSpeed >= 0 (where scrollSpeed = currentScrollY - lastScrollY)
      if (elementRect.top - (currentScrollY - lastScrollY) >= 0) {
        // Element will be visible at top on next scroll event - make it sticky now
        isSticky = true;
        element.style.position = 'sticky';
        element.style.top = '0';
      }
      // Second priority: If scrolling up and element is not yet visible, position above viewport
      // Check: scrolling up AND element not visible (bottom > 0 AND top < window height)
      else if (
        currentScrollY < lastScrollY &&
        !(elementRect.bottom > 0 && elementRect.top < window.innerHeight)
      ) {
        // ...move the element to be just above the viewport, ready to be revealed.
        element.style.position = 'relative';
        // Position element just above viewport so it scrolls into view naturally
        element.style.top = `${currentScrollY - element.offsetHeight}px`;
      }
    }
    // Handle sticky mode logic - release from sticky when scrolling down
    else if (currentScrollY > lastScrollY) {
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
