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
 * - Transitions to sticky when element's top edge reaches viewport top (elementRect.top >= 0)
 */
export function naturalStickyTop(element: HTMLElement) {
  let lastScrollY = window.scrollY;
  let mode = 'relative';

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const scrollingUp = currentScrollY < lastScrollY;
    const elementHeight = element.offsetHeight;
    const elementRect = element.getBoundingClientRect();
    const isElementVisible = elementRect.bottom > 0 && elementRect.top < window.innerHeight;

    // If we are sticky and scroll down, release the element.
    if (mode === 'sticky' && scrollingDown) {
      mode = 'relative';
      element.style.position = 'relative';
      // Position element at current scroll position so it moves naturally with content
      element.style.top = `${currentScrollY}px`;
    }
    // If we are released and scrolling up, and the element is not yet visible...
    else if (mode === 'relative' && scrollingUp && !isElementVisible) {
        // ...move the element to be just above the viewport, ready to be revealed.
        element.style.position = 'relative';
        // Position element just above viewport so it scrolls into view naturally
        element.style.top = `${currentScrollY - elementHeight}px`;
    }
    // If we are released and the element has scrolled into view at the top...
    else if (mode === 'relative' && elementRect.top >= 0) {
      // ...make it sticky again.
      mode = 'sticky';
      element.style.position = 'sticky';
      element.style.top = '0';
    }

    lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
  };

  // Run once on load to set the initial state correctly.
  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });

  return {
    destroy: () => {
      window.removeEventListener("scroll", handleScroll);
    },
  };
}

// Export as default for UMD build
export default naturalStickyTop;
