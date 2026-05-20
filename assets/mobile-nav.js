// TradeScale Plus — mobile nav toggle
(function() {
  function init() {
    var burger = document.querySelector('.tsp-burger');
    var drawer = document.querySelector('.tsp-drawer');
    if (!burger || !drawer) return;

    burger.addEventListener('click', function() {
      var open = drawer.getAttribute('data-open') === 'true';
      drawer.setAttribute('data-open', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      document.body.style.overflow = open ? '' : 'hidden';
    });

    // Close drawer when a link inside is tapped
    drawer.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        drawer.setAttribute('data-open', 'false');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') {
        drawer.setAttribute('data-open', 'false');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
