document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('.news-tab'));
  function showList(section) {
    const list = section.querySelector('.news-article-list');
    if (list) list.hidden = false;
    section.querySelectorAll('.news-article-panel').forEach(article => { article.hidden = true; });
    section.querySelectorAll('.news-article-card').forEach(card => card.setAttribute('aria-expanded', 'false'));
  }
  function activate(id, updateHash = true) {
    if (!tabs.some(tab => tab.dataset.tab === id)) return;
    tabs.forEach(tab => {
      const active = tab.dataset.tab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const section = document.getElementById(tab.dataset.tab);
      if (section) { section.hidden = !active; if (active) showList(section); }
    });
    if (updateHash) history.replaceState(null, '', '#' + id);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus(); activate(tabs[next].dataset.tab);
    });
  });
  document.querySelectorAll('.news-article-card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.closest('.news-detail');
      const article = document.getElementById(card.dataset.article);
      if (!section || !article) return;
      showList(section);
      section.querySelector('.news-article-list').hidden = true;
      article.hidden = false;
      card.setAttribute('aria-expanded', 'true');
      article.scrollIntoView({block:'start',behavior:'smooth'});
    });
  });
  document.querySelectorAll('.news-back-button').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.news-detail');
      if (!section) return;
      showList(section);
      section.querySelector('.news-article-list').scrollIntoView({block:'start',behavior:'smooth'});
    });
  });
  activate(location.hash.slice(1) || 'vingadores', false);
  window.addEventListener('hashchange', () => activate(location.hash.slice(1), false));
});
