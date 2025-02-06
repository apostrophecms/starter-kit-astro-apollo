/**
 * Adjusts the body padding to accommodate a fixed-position navbar.
 * This prevents the navbar from overlapping the page content.
 *
 * @function adjustBodyPadding
 * @requires DOM element with classes 'navbar' and 'is-fixed-top'
 * @listens DOMContentLoaded
 * @description
 * Calculates the height of the fixed navbar and sets the body's top padding
 * to match, ensuring content below the navbar is fully visible. The function
 * is called when the DOM content is loaded.
 *
 * @example
 * // HTML structure required:
 * // <nav class="navbar is-fixed-top">...</nav>
 */
const adjustBodyPadding = () => {
  const navbar = document.querySelector('.navbar.is-fixed-top');
  if (navbar) {
    document.body.style.paddingTop = `${navbar.offsetHeight}px`;
  }
};

document.addEventListener('DOMContentLoaded', adjustBodyPadding);