/**
 * Drag-to-scroll functionality for demo pages
 * This provides a touch-like scrolling experience with grab cursors
 */
document.addEventListener('DOMContentLoaded', () => {
  let isDragging = false;
  let startY = 0;
  let startScrollY = 0;

  document.addEventListener('mousedown', e => {
    isDragging = true;
    startY = e.clientY;
    startScrollY = window.scrollY;
    document.body.classList.add('dragging');
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;

    e.preventDefault();
    const deltaY = startY - e.clientY; // Invert direction for natural feel
    window.scrollTo(0, startScrollY + deltaY);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.classList.remove('dragging');
  });

  // Handle mouse leave to stop dragging
  document.addEventListener('mouseleave', () => {
    isDragging = false;
    document.body.classList.remove('dragging');
  });
});
