document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('filmsSearch');
  const tiles = [...document.querySelectorAll('.film-tile')];
  const filters = [...document.querySelectorAll('.films-filter')];
  const empty = document.getElementById('filmsEmpty');
  const pad = n => String(n).padStart(2, '0');
  document.querySelector('.films-filter[data-filter="todos"] span').textContent = pad(tiles.length);
  document.querySelector('.films-banner-meta span').textContent = pad(tiles.length) + ' títulos em destaque';
  let genre = 'todos';
  const query = new URLSearchParams(window.location.search).get('q');
  if (query) search.value = query;
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function update() {
    const term = normalize(search.value.trim());
    let count = 0;
    tiles.forEach(tile => {
      const matchesGenre = genre === 'todos' || tile.dataset.genres.split(' ').includes(genre);
      const matchesSearch = term.split(/\s+/).every(word => normalize(tile.dataset.title + ' ' + tile.textContent).includes(word));
      tile.hidden = !(matchesGenre && matchesSearch);
      if (!tile.hidden) count++;
    });
    empty.hidden = count > 0;
  }
  filters.forEach(btn => btn.addEventListener('click', () => {
    genre = btn.dataset.filter;
    filters.forEach(item => {
      const active = item === btn;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    update();
  }));
  search.addEventListener('input', update);
  update();
  const films = {
    vingadores: { title:'Vingadores: Doutor Destino', genre:'2026 • Ação / Ficção científica', poster:'assets/imagens/vingadoresdoutordestino_5.jpg', description:'Os Vingadores retornam em uma nova produção do universo cinematográfico Marvel, com Doutor Destino no centro da história.', trailer:'trailers.html#vingadores', news:'noticias.html#vingadores' },
    street: { title:'Street Fighter', genre:'2026 • Ação / Artes marciais', poster:'assets/imagens/srtreetfigher.jpg', description:'Uma adaptação cinematográfica do universo de Street Fighter, franquia de jogos conhecida pelos combates e personagens marcantes.', trailer:'trailers.html#street', news:'noticias.html#street-fighter' },
    narnia: { title:'Nárnia: O Sobrinho do Mago', genre:'Fantasia / Aventura', poster:'assets/imagens/narnia-promocional.jpg', description:'Uma aventura fantástica baseada no livro de C. S. Lewis que explora a origem do mundo de Nárnia.', trailer:'trailers.html#narnia', news:'noticias.html#narnia' },
    clayface: { title:'Cara de Barro (Clayface)', genre:'2026 • Terror / Suspense', poster:'assets/imagens/clayface.jpg', description:'Uma história sombria centrada no personagem Cara de Barro, do universo DC.', trailer:'trailers.html#clayface', news:'noticias.html#cara-de-barro' },
    'supergirl': { title:'Supergirl', genre:'2026 • Ação / Ficção científica', poster:'assets/imagens/supergirl-cartaz-oficial.jpg', description:'Uma aventura de ação e ficção científica com a heroína kryptoniana do universo DC no centro da história.', trailer:'trailers.html#supergirl', news:'noticias.html#supergirl' },
    'homem-aranha': { title:'Homem-Aranha: Um Novo Dia', genre:'2026 • Ação / Ficção científica', poster:'assets/imagens/homem-aranha.jpg', description:'Uma nova aventura do amigão da vizinhança dentro do universo cinematográfico Marvel.', trailer:'trailers.html#homem-aranha', news:'noticias.html#homem-aranha' },
    'toy-story-5': { title:'Toy Story 5', genre:'2026 • Animação / Aventura', poster:'assets/imagens/toy-story-5.jpg', description:'A turma de brinquedos mais querida do cinema volta em uma nova aventura animada, para toda a família.', trailer:'trailers.html#toy-story-5', news:'noticias.html#toy-story-5' },
    'odisseia': { title:'A Odisseia', genre:'2026 • Aventura / Épico', poster:'assets/imagens/odisseia-cartaz-oficial.jpg', description:'Christopher Nolan adapta o poema de Homero, com Matt Damon. Estreou nos cinemas em julho de 2026.', trailer:'trailers.html#odisseia', news:'noticias.html#odisseia' },
    'duna-3': { title:'Duna: Parte Três', genre:'2026 • Ficção científica', poster:'assets/imagens/duna-3.jpg', description:'Terceiro filme da saga de ficção científica, com estreia prevista para 18 de dezembro de 2026, no mesmo dia de Vingadores: Doutor Destino.', trailer:'trailers.html#duna-3', news:'noticias.html#duna-3' },
    'super-mario-galaxy': { title:'Super Mario Galaxy: O Filme', genre:'2026 • Animação / Aventura', poster:'assets/imagens/super-mario-galaxy.jpg', description:'Nova aventura animada baseada nos jogos da Nintendo, nos cinemas desde 1º de abril de 2026.', trailer:'trailers.html#super-mario-galaxy', news:'noticias.html#super-mario-galaxy' },
    'michael': { title:'Michael', genre:'2026 • Drama / Musical', poster:'assets/imagens/michael.jpg', description:'Cinebiografia musical sobre Michael Jackson, nos cinemas desde 23 de abril de 2026.', trailer:'trailers.html#michael', news:'noticias.html#michael' },
    'diabo-veste-prada-2': { title:'O Diabo Veste Prada 2', genre:'2026 • Comédia / Drama', poster:'assets/imagens/diabo-veste-prada-2.png', description:'Continuação da comédia sobre o mundo da moda, nos cinemas desde 30 de abril de 2026.', trailer:'trailers.html#diabo-veste-prada-2', news:'noticias.html#diabo-veste-prada-2' },
    'jogos-vorazes': { title:'Jogos Vorazes: Amanhecer na Colheita', genre:'2026 • Ação / Ficção científica', poster:'assets/imagens/jogos-vorazes.jpg', description:'Novo capítulo da saga Jogos Vorazes, baseado nos livros de Suzanne Collins, com estreia em 2026.', trailer:'trailers.html#jogos-vorazes', news:'noticias.html#jogos-vorazes' },
    'moana': { title:'Moana (live-action)', genre:'2026 • Aventura / Fantasia', poster:'assets/imagens/moana.jpg', description:'Versão em live-action da animação da Disney, nos cinemas desde julho de 2026.', trailer:'trailers.html#moana', news:'noticias.html#moana' },
  };
  const modal = document.getElementById('filmModal');
  const close = document.getElementById('filmModalClose');
  let lastFocus = null;
  function hideModal() { modal.hidden = true; document.body.classList.remove('film-modal-open'); lastFocus?.focus(); }
  document.querySelectorAll('.film-detail-btn').forEach(btn => btn.addEventListener('click', () => {
    const film = films[btn.dataset.film];
    lastFocus = btn;
    document.getElementById('filmModalTitle').textContent = film.title;
    document.getElementById('filmModalGenre').textContent = film.genre;
    document.getElementById('filmModalDescription').textContent = film.description;
    document.getElementById('filmModalPoster').src = film.poster;
    document.getElementById('filmModalPoster').alt = 'Cartaz de ' + film.title;
    document.getElementById('filmModalTrailer').href = film.trailer;
    document.getElementById('filmModalNews').href = film.news;
    modal.hidden = false;
    document.body.classList.add('film-modal-open');
    close.focus();
  }));
  close.addEventListener('click', hideModal);
  modal.addEventListener('click', event => { if (event.target === modal) hideModal(); });
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') hideModal();
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button,a')];
      const first = focusable[0], last = focusable[focusable.length-1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
});
