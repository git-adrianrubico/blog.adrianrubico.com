document.addEventListener('DOMContentLoaded', function() {
  const mobileNav = document.querySelector('.mobile-nav');
  const navMenuBtn = document.querySelector('.nav-menu-btn');
  const navCloseBtn = document.querySelector('.nav-close-btn');
  const mainContent = document.querySelector('main');
  const overlay = document.querySelector('.overlay');
  const forFilter = document.querySelector('.for-filter');

  function closeMobileNav() {
    mobileNav.classList.remove('active');
    mainContent.style.filter = '';
    mainContent.style.pointerEvents = '';
    forFilter.style.filter = '';
    forFilter.style.pointerEvents = '';
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Add event listener to elements that should close the mobile nav
  $(document).on('click', '.posts-header-desktopview, .posts-header-mobileview', function (e) {
    closeMobileNav();
  });

  // Open mobile nav when the menu button is clicked
  navMenuBtn.addEventListener('click', function() {
    mobileNav.classList.add('active');

    mainContent.style.pointerEvents = 'none';

    overlay.style.display = 'block';
    forFilter.style.pointerEvents = 'none';
    document.body.style.overflow = 'hidden';
  });

  // Close mobile nav when the close button is clicked
  navCloseBtn.addEventListener('click', closeMobileNav);

  // Close mobile nav when clicking outside of it
  document.addEventListener('click', function(event) {
    if (!mobileNav.contains(event.target) && !navMenuBtn.contains(event.target)) {
      closeMobileNav();
    }
  });

  // Close mobile nav when scrolling outside of it
  document.addEventListener('scroll', function() {
    if (mobileNav.classList.contains('active') && !isInsideMobileNavScrollableArea()) {
      closeMobileNav();
    }
  });

  // Close mobile nav on viewport size change (max-width: 1023px)
  const mediaQuery = window.matchMedia('(min-width: 768px)');

  function handleMediaQueryChange() {
    if (mediaQuery.matches && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  }

  mediaQuery.addEventListener('change', handleMediaQueryChange);
  handleMediaQueryChange(); // Check on initial load

  function isInsideMobileNavScrollableArea() {
    const mobileNavRect = mobileNav.getBoundingClientRect();
    return (
      window.scrollY >= mobileNavRect.top &&
      window.scrollY <= mobileNavRect.bottom
    );
  }
});
