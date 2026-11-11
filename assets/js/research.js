// Research page: switch between groupings, and open a card's details in a dialog.
// Every grouping is already on the page; this shows one at a time. Without JavaScript the first
// grouping shows and each card expands in place.
(function () {
  var bar = document.querySelector('.lens-bar');
  var boards = Array.prototype.slice.call(document.querySelectorAll('.board[data-lens]'));
  if (!bar || !boards.length) return;

  var buttons = Array.prototype.slice.call(bar.querySelectorAll('button.lens'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var current = boards[0].dataset.lens;

  function setLens(id, animate) {
    var board = boards.filter(function (b) { return b.dataset.lens === id; })[0];
    if (!board) return;
    current = id;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lens === id)); });
    boards.forEach(function (b) { b.hidden = b !== board; });
    if (animate && !reduceMotion.matches && board.animate) {
      board.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        { duration: 320, easing: 'ease-out' });
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lens === current) return;
      setLens(b.dataset.lens, true);
      try { history.replaceState(null, '', b.dataset.lens === boards[0].dataset.lens ? location.pathname : '#lens-' + b.dataset.lens); } catch (e) {}
    });
  });

  // #lens-method opens that grouping; a link to a folder (e.g. #group-vision from the home page)
  // opens the grouping that holds it and scrolls to it.
  function followHash() {
    var hash = location.hash.replace('#', '');
    if (hash.indexOf('lens-') === 0) setLens(hash.slice(5), false);
    if (hash.indexOf('group-') === 0) {
      var target = document.getElementById(hash);
      var owner = target && target.closest('.board[data-lens]');
      if (owner) {
        setLens(owner.dataset.lens, false);
        requestAnimationFrame(function () { target.scrollIntoView(); });
      }
    }
  }
  followHash();
  window.addEventListener('hashchange', followHash);

  // Card details in a dialog
  var dialog = document.getElementById('card-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var dFigure = dialog.querySelector('.dialog-figure');
  var dTitle = dialog.querySelector('.dialog-title');
  var dBody = dialog.querySelector('.dialog-body');

  document.addEventListener('click', function (e) {
    var summary = e.target.closest('.board summary');
    if (!summary) return;
    e.preventDefault();
    var card = summary.closest('.card');
    dialog.className = 'card-dialog ' + Array.prototype.filter.call(card.classList, function (c) { return c.indexOf('theme-') === 0; }).join(' ');
    dialog.classList.add('card');
    dFigure.innerHTML = ''; dBody.innerHTML = '';
    dFigure.appendChild(card.querySelector('.card-figure').cloneNode(true));
    dTitle.textContent = card.querySelector('.card-title').textContent;
    dBody.appendChild(card.querySelector('.card-body').cloneNode(true));
    dialog.showModal();
  });
  dialog.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
})();
