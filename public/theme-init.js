// Runs before the app bundle so the first paint already uses the stored or system color scheme.
(function () {
  var mode = null;
  try {
    mode = localStorage.getItem('mui-mode');
  } catch (e) {
    mode = null;
  }
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var dark = mode === 'dark' || (mode !== 'light' && prefersDark);
  document.documentElement.setAttribute('data-mui-color-scheme', dark ? 'dark' : 'light');
})();
