// Home page: the tiles start shuffled and settle into place once, on page load.
// Each tile flies in from another tile's position, so the same pieces recombine into the final pattern.
(function () {
  var field = document.querySelector('.tiles');
  if (!field || !field.animate) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var tiles = Array.prototype.slice.call(field.children);
  var rects = tiles.map(function (t) { return t.getBoundingClientRect(); });
  var order = tiles.map(function (_, i) { return i; });
  for (var i = order.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
  }
  tiles.forEach(function (tile, i) {
    var from = rects[order[i]], to = rects[i];
    tile.animate(
      [
        { transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px)', opacity: 0.25 },
        { transform: 'none', opacity: 1 }
      ],
      { duration: 1100, delay: 150 + (i % 8) * 25, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
    );
  });
})();
