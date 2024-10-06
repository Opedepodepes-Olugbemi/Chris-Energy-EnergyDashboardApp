document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger-menu');
  const nav = document.getElementById('nav-menu');

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickInsideHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickInsideHamburger && nav.classList.contains('active')) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    }
  });

  // Close menu when clicking a nav link (for single page applications)
  const navLinks = nav.getElementsByTagName('a');
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function() {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  }
});
