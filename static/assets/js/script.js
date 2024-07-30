'use strict';

// navbar variables
const nav = document.querySelector('.mobile-nav');
const navMenuBtn = document.querySelector('.nav-menu-btn');
const navCloseBtn = document.querySelector('.nav-close-btn');
const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
// theme toggle variables
const themeBtn = document.querySelectorAll('.theme-btn');

// navToggle function
const navToggleFunc = function () { nav.classList.toggle('active'); }

navMenuBtn.addEventListener('click', navToggleFunc);
navCloseBtn.addEventListener('click', navToggleFunc);

// Function to detect user's preferred color scheme
function detectColorScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Function to toggle theme classes
function toggleThemeClasses(userColorScheme) {
  document.body.classList.toggle('light-theme', userColorScheme === 'light');
  document.body.classList.toggle('dark-theme', userColorScheme === 'dark');

  for (let i = 0; i < themeBtn.length; i++) {
    themeBtn[i].classList.toggle('light', userColorScheme === 'light');
    themeBtn[i].classList.toggle('dark', userColorScheme === 'dark');
  }
}

// Function to update theme color meta tag
function updateThemeColor() {
  if (document.body.classList.contains('dark-theme')) {
    themeColorMetaTag.setAttribute('content', '#161515');
  } else {
    themeColorMetaTag.setAttribute('content', '#f9fafb');
  }
}

// Get stored theme from localStorage or use the user's preferred color scheme
const storedTheme = localStorage.getItem('theme');
const userColorScheme = storedTheme || detectColorScheme();

// Set initial theme based on user's color scheme preference
toggleThemeClasses(userColorScheme);
updateThemeColor();

// Store the selected theme in localStorage when the theme is toggled
function storeTheme(theme) {
  localStorage.setItem('theme', theme);
}

// Event listener for theme toggle
for (let i = 0; i < themeBtn.length; i++) {
  themeBtn[i].addEventListener('click', function () {
    // Toggle `light-theme` & `dark-theme` class from `body`
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    // Toggle classes between `light` & `dark` for all `theme-btn`
    for (let i = 0; i < themeBtn.length; i++) {
      themeBtn[i].classList.toggle('light');
      themeBtn[i].classList.toggle('dark');
    }

    // Get the current theme after toggling
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';

    // Store the selected theme
    storeTheme(currentTheme);

    // Update theme color meta tag
    updateThemeColor();
  });
}
