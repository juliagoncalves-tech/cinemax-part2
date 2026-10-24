
document.addEventListener("DOMContentLoaded", () => {
  // Navegadores podem bloquear armazenamento ao abrir arquivos locais.
  const volatileStore = {};
  const safeStorage = {
    getItem(key) { try { return window.localStorage.getItem(key); } catch (_) { return volatileStore[key] || null; } },
    setItem(key, value) { try { window.localStorage.setItem(key, value); } catch (_) { volatileStore[key] = value; } },
    removeItem(key) { try { window.localStorage.removeItem(key); } catch (_) { delete volatileStore[key]; } }
  };
  const USERS_KEY = "cinemax_users";
  const SESSION_KEY = "cinemax_user";

  const MOCK_USER = {
    email: "usuario@cinemax.com",
    password: "123",
    name: "Cinefilo"
  };

  // Inicializa os usuários de demonstração
  function getUsers() {
    try {
      const users = JSON.parse(safeStorage.getItem(USERS_KEY));
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    safeStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  if (!getUsers().some(
    user => user.email === MOCK_USER.email
  )) {
    saveUsers([...getUsers(), MOCK_USER]);
  }

  // Cria a interface de autenticação
  function injectAuthUI() {
    const header = document.querySelector(".header .container");

    if (!header) {
      console.error("Não foi encontrado .header .container no HTML.");
      return false;
    }

    if (!document.getElementById("authNav")) {
      const authNav = document.createElement("div");
      authNav.className = "auth-nav";
      authNav.id = "authNav";
      header.appendChild(authNav);
    }

    if (!document.getElementById("loginModal")) {
      document.body.insertAdjacentHTML("beforeend", `
        <div class="modal" id="loginModal">
          <div class="modal-content">
            <button type="button" class="close-modal"
              id="closeModalBtn" aria-label="Fechar">&times;</button>

            <h2 id="modalTitle">Acessar Conta</h2>

            <div class="auth-tabs">
              <button type="button" id="showLoginBtn"
                class="button">Entrar</button>
              <button type="button" id="showRegisterBtn"
                class="button">Cadastrar</button>
            </div>

            <form id="loginForm">
              <div class="form-group">
                <label for="loginEmail">E-mail</label>
                <input type="email" id="loginEmail"
                  autocomplete="email" required
                  placeholder="seu@email.com">
              </div>

              <div class="form-group">
                <label for="loginPassword">Senha</label>
                <input type="password" id="loginPassword"
                  autocomplete="current-password" required
                  placeholder="Digite sua senha">
              </div>

              <p class="error-message" id="loginError"
                role="alert"></p>

              <button type="submit" class="button"
                style="width:100%">Entrar</button>
            </form>

            <form id="registerForm" hidden>
              <div class="form-group">
                <label for="registerName">Nome</label>
                <input type="text" id="registerName"
                  autocomplete="name" required minlength="2"
                  maxlength="80" placeholder="Seu nome">
              </div>

              <div class="form-group">
                <label for="registerEmail">E-mail</label>
                <input type="email" id="registerEmail"
                  autocomplete="email" required
                  placeholder="seu@email.com">
              </div>

              <div class="form-group">
                <label for="registerPassword">Senha</label>
                <input type="password" id="registerPassword"
                  autocomplete="new-password" required
                  minlength="8" placeholder="Mínimo de 8 caracteres">
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirmar senha</label>
                <input type="password" id="confirmPassword"
                  autocomplete="new-password" required
                  minlength="8" placeholder="Repita sua senha">
              </div>

              <p class="error-message" id="registerError"
                role="alert"></p>

              <button type="submit" class="button"
                style="width:100%">Criar conta</button>
            </form>
          </div>
        </div>
      `);
    }

    return true;
  }

  if (!injectAuthUI()) return;

  const modal = document.getElementById("loginModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginError = document.getElementById("loginError");
  const registerError = document.getElementById("registerError");
  const modalTitle = document.getElementById("modalTitle");

  function showError(element, message = "") {
    element.textContent = message;
  }

  function toggleModal(show) {
    modal.classList.toggle("active", show);
    if (show) {
      showError(loginError);
      showError(registerError);
    }
  }

  function switchForm(mode) {
    const isLogin = mode === "login";

    loginForm.hidden = !isLogin;
    registerForm.hidden = isLogin;
    modalTitle.textContent = isLogin
      ? "Acessar Conta"
      : "Criar Conta";

    showError(loginError);
    showError(registerError);
  }

  document.getElementById("showLoginBtn").addEventListener(
    "click", () => switchForm("login")
  );

  document.getElementById("showRegisterBtn").addEventListener(
    "click", () => switchForm("register")
  );

  closeBtn.addEventListener("click", () => toggleModal(false));

  modal.addEventListener("click", event => {
    if (event.target === modal) toggleModal(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") toggleModal(false);
  });

  // Cadastro
  registerForm.addEventListener("submit", event => {
    event.preventDefault();
    showError(registerError);

    const name = document.getElementById("registerName")
      .value.trim();
    const email = document.getElementById("registerEmail")
      .value.trim().toLowerCase();
    const password = document.getElementById("registerPassword")
      .value;
    const confirmation = document.getElementById("confirmPassword")
      .value;

    if (name.length < 2) {
      showError(registerError, "Informe seu nome completo.");
      return;
    }

    if (password.length < 8) {
      showError(registerError, "A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmation) {
      showError(registerError, "As senhas não coincidem.");
      return;
    }

    const users = getUsers();

    if (users.some(user =>
      user.email.toLowerCase() === email
    )) {
      showError(registerError, "Este e-mail já está cadastrado.");
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    registerForm.reset();
    document.getElementById("loginEmail").value = email;
    switchForm("login");
    showError(loginError, "Cadastro realizado! Agora entre na sua conta.");
  });

  // Login
  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    showError(loginError);

    const email = document.getElementById("loginEmail")
      .value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = getUsers().find(item =>
      item.email.toLowerCase() === email &&
      item.password === password
    );

    if (!user) {
      showError(loginError, "E-mail ou senha incorretos.");
      return;
    }

    safeStorage.setItem(SESSION_KEY, JSON.stringify({
      name: user.name,
      email: user.email
    }));

    loginForm.reset();
    toggleModal(false);
    renderAuthNav();
  });

  // Atualiza o cabeçalho
  function renderAuthNav() {
    const nav = document.getElementById("authNav");
    let user = null;

    try {
      user = JSON.parse(safeStorage.getItem(SESSION_KEY));
    } catch {
      safeStorage.removeItem(SESSION_KEY);
    }

    nav.replaceChildren();

    if (user && typeof user.name === "string") {
      const profile = document.createElement("div");
      profile.className = "user-profile";

      const greeting = document.createElement("span");
      greeting.append("Olá, ");

      const name = document.createElement("strong");
      name.textContent = user.name;
      greeting.appendChild(name);

      const logout = document.createElement("button");
      logout.type = "button";
      logout.className = "logout-btn";
      logout.textContent = "Sair";
      logout.addEventListener("click", () => {
        safeStorage.removeItem(SESSION_KEY);
        renderAuthNav();
      });

      profile.append(greeting, logout);
      nav.appendChild(profile);
    } else {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button";
      button.textContent = "Entrar";
      button.addEventListener("click", () => {
        switchForm("login");
        toggleModal(true);
      });
      nav.appendChild(button);
    }
  }

  renderAuthNav();
});


// Busca global: funciona no cabeçalho de todas as páginas.
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const box = input.closest('.search');
  const button = box?.querySelector('button');
  if (!box || !button) return;
  const form = document.createElement('form');
  form.className = 'site-search-form';
  form.setAttribute('role', 'search');
  box.parentNode.insertBefore(form, box);
  form.appendChild(box);
  input.setAttribute('type', 'search');
  input.setAttribute('aria-label', 'Buscar filmes no CineMax');
  input.setAttribute('autocomplete', 'off');
  button.type = 'submit';
  button.setAttribute('aria-label', 'Pesquisar filmes');
  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const movies = [
    {
        "title": "Vingadores: Doutor Destino",
        "terms": "vingadores doutor destino avengers doomsday 2026 • Ação / Ficção científica",
        "id": "vingadores"
    },
    {
        "title": "Street Fighter",
        "terms": "street fighter 2026 • Ação / Artes marciais",
        "id": "street-fighter"
    },
    {
        "title": "Cara de Barro (Clayface)",
        "terms": "cara de barro clayface 2026 • Terror / Suspense",
        "id": "cara-de-barro"
    },
    {
        "title": "Nárnia: O Sobrinho do Mago",
        "terms": "narnia o sobrinho do mago cronicas de narnia Fantasia • Aventura",
        "id": "narnia"
    },
    {
        "title": "Supergirl",
        "terms": "supergirl 2026 • Ação / Ficção científica",
        "id": "supergirl"
    },
    {
        "title": "Homem-Aranha: Um Novo Dia",
        "terms": "homem-aranha: um novo dia 2026 • Ação / Ficção científica",
        "id": "homem-aranha"
    },
    {
        "title": "Toy Story 5",
        "terms": "toy story 5 2026 • Animação / Aventura",
        "id": "toy-story-5"
    },
    {
        "title": "A Odisseia",
        "terms": "a odisseia cinema 2026 • Aventura / Épico",
        "id": "odisseia"
    },
    {
        "title": "Duna: Parte Três",
        "terms": "duna: parte três cinema 2026 • Ficção científica",
        "id": "duna-3"
    },
    {
        "title": "Super Mario Galaxy: O Filme",
        "terms": "super mario galaxy: o filme animação 2026 • Animação / Aventura",
        "id": "super-mario-galaxy"
    },
    {
        "title": "Michael",
        "terms": "michael cinema 2026 • Drama / Musical",
        "id": "michael"
    },
    {
        "title": "O Diabo Veste Prada 2",
        "terms": "o diabo veste prada 2 cinema 2026 • Comédia / Drama",
        "id": "diabo-veste-prada-2"
    },
    {
        "title": "Jogos Vorazes: Amanhecer na Colheita",
        "terms": "jogos vorazes: amanhecer na colheita cinema 2026 • Ação / Ficção científica",
        "id": "jogos-vorazes"
    },
    {
        "title": "Moana (live-action)",
        "terms": "moana (live-action) cinema 2026 • Aventura / Fantasia",
        "id": "moana"
    }
];
  const suggestions = document.createElement('div');
  suggestions.className = 'site-search-suggestions';
  suggestions.id = 'siteSearchSuggestions';
  suggestions.hidden = true;
  suggestions.setAttribute('role', 'listbox');
  box.appendChild(suggestions);
  const params = new URLSearchParams(location.search);
  if (location.pathname.endsWith('filmes.html') && params.has('q')) input.value = params.get('q');
  function refresh() {
    const term = normalize(input.value.trim());
    suggestions.replaceChildren();
    if (!term) { suggestions.hidden = true; return; }
    const found = movies.filter(m => normalize(m.title + ' ' + m.terms).includes(term));
    if (!found.length) {
      const message = document.createElement('p');
      message.textContent = 'Nenhum filme encontrado';
      suggestions.appendChild(message);
    }
    for (const movie of found) {
      const link = document.createElement('a');
      link.href = 'filmes.html?q=' + encodeURIComponent(movie.title) + '#' + movie.id;
      link.textContent = movie.title;
      link.setAttribute('role', 'option');
      suggestions.appendChild(link);
    }
    suggestions.hidden = false;
  }
  input.addEventListener('input', refresh);
  input.addEventListener('focus', refresh);
  document.addEventListener('click', event => {
    if (!box.contains(event.target)) suggestions.hidden = true;
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') suggestions.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const q = input.value.trim();
    if (!q) { input.focus(); return; }
    const exact = movies.find(m => normalize(m.title) === normalize(q));
    location.href = 'filmes.html?q=' + encodeURIComponent(exact ? exact.title : q) + (exact ? '#' + exact.id : '');
  });
});
