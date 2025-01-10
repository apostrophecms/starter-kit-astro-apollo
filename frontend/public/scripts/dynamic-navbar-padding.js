const adjustBodyPadding = () => {
  const navbar = document.querySelector('.navbar.is-fixed-top');
  if (navbar) {
    document.body.style.paddingTop = `${navbar.offsetHeight}px`;
  }
};

document.addEventListener('DOMContentLoaded', adjustBodyPadding);