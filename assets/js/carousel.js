// People page: photo carousel. Without JavaScript the photos still scroll sideways.
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var slides = track.children;
    var prev = root.querySelector('.carousel-prev');
    var next = root.querySelector('.carousel-next');
    var dots = root.querySelectorAll('.carousel-dots button:not(.carousel-pause)');
    var pause = root.querySelector('.carousel-pause');
    if (!prev) return;
    function index() { return Math.round(track.scrollLeft / track.clientWidth); }
    function go(i) { track.scrollTo({ left: i * track.clientWidth }); }
    function update() {
      var i = index();
      prev.disabled = i <= 0;
      next.disabled = i >= slides.length - 1;
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }
    prev.addEventListener('click', function () { go(index() - 1); });
    next.addEventListener('click', function () { go(index() + 1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index() - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index() + 1); }
    });
    var t; track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 60); });
    window.addEventListener('resize', update);
    update();

    // Optional slideshow: advances every data-autoplay ms, loops, pauses on hover, focus,
    // a hidden tab, or the Pause button. Off for people who ask for reduced motion.
    var delay = parseInt(root.getAttribute('data-autoplay'), 10);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!delay || reduce || slides.length < 2) { if (pause) pause.hidden = true; return; }
    var stopped = false, held = false, timer = null;
    function tick() { if (stopped || held || document.hidden) return; var i = index(); go(i >= slides.length - 1 ? 0 : i + 1); }
    function start() { clearInterval(timer); timer = setInterval(tick, delay); }
    root.addEventListener('mouseenter', function () { held = true; });
    root.addEventListener('mouseleave', function () { held = false; });
    root.addEventListener('focusin', function (e) { if (e.target !== pause) held = true; });
    root.addEventListener('focusout', function () { held = false; });
    if (pause) pause.addEventListener('click', function () {
      stopped = !stopped; pause.setAttribute('aria-pressed', stopped ? 'true' : 'false');
      pause.setAttribute('aria-label', stopped ? 'Play slideshow' : 'Pause slideshow');
    });
    [prev, next].concat(Array.prototype.slice.call(dots)).forEach(function (b) { b.addEventListener('click', start); });
    start();
  });
})();
