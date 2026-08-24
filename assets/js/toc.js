/* ============================================================
   toc.js — auto-generated table of contents for long articles.
   Looks for <article data-toc> and builds a linked list from its
   <h2> elements. No-op if there are too few sections to bother.
============================================================ */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var article = document.querySelector('article[data-toc]');
    if (!article) return;
    var heads = article.querySelectorAll('h2');
    if (heads.length < 3) return;

    var nav = document.createElement('nav');
    nav.className = 'toc';
    nav.setAttribute('aria-label', 'Table of contents');

    var title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = 'Contents';
    nav.appendChild(title);

    var list = document.createElement('ol');
    heads.forEach(function (h, i) {
      if (!h.id) {
        h.id = 's' + (i + 1) + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });
    nav.appendChild(list);

    var lede = article.querySelector('.lede');
    var anchor = lede || article.querySelector('.meta');
    if (anchor && anchor.nextSibling) {
      anchor.parentNode.insertBefore(nav, anchor.nextSibling);
    } else {
      article.insertBefore(nav, article.firstChild);
    }
  });
})();
