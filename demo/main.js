document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.sticky-header');
  const footer = document.querySelector('.sticky-footer');

  if (header && window.naturalStickyTop) {
    window.naturalStickyTop(header);
  }

  if (footer && window.naturalStickyBottom) {
    window.naturalStickyBottom(footer);
  }
});
