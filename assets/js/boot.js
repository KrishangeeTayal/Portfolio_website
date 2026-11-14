/* Runs before first paint so the reveal state is never applied late.
   Adds .js-reveal to <html> only when the visitor has not asked for
   reduced motion — which is what makes the hidden state opt-in. */
(function () {
  var d = document.documentElement;
  var reduce = false;
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}
  if (!reduce) d.className += ' js-reveal';
})();
