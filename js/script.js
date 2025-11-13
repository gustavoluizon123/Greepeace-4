(() => {
  "use strict";

  /* ==========================
     THEME / HIGH CONTRAST HANDLER
     ========================== */
  const THEME_KEY = "ong_theme_pref"; // localStorage key
  const VALID_THEMES = ["light", "dark", "high-contrast"];

  // fornece rótulo humano para status (sr-only element)
  const themeLabel = {
    "light": "Tema claro",
    "dark": "Tema escuro",
    "high-contrast": "Alto contraste"
  };

  // aplica theme ao HTML
  function applyTheme(theme) {
    if (!theme || !VALID_THEMES.includes(theme)) theme = "light";
    const html = document.documentElement;
    if (theme === "light") {
      html.removeAttribute("data-theme");
      html.removeAttribute("data-theme-previous");
      html.removeAttribute("data-theme-mode");
      html.removeAttribute("data-theme"); // fallback
      html.removeAttribute("data-theme");
      html.removeAttribute("data-theme");
      html.removeAttribute("data-theme");
      html.removeAttribute("data-theme");
      html.removeAttribute("data-theme");
      html.removeAttribute("data-theme");
      html.removeAttribute("data-theme");
      // explicitly set to empty (light default)
      html.removeAttribute("data-theme");
    } else {
      html.setAttribute("data-theme", theme === "high-contrast" ? "high-contrast" : "dark");
    }

    // Atualiza botão e status
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.setAttribute("aria-pressed", theme !== "light" ? "true" : "false");
      // atualiza ícone (simples)
      const icon = btn.querySelector(".theme-icon");
      if (icon) {
        icon.textContent = theme === "dark" ? "🌙" : theme === "high-contrast" ? "⚫️⚪️" : "☀️";
      }
    }

    const status = document.getElementById("themeStatus");
    if (status) {
      status.textContent = `Tema aplicado: ${themeLabel[theme] || "Padrão"}`;
    }
  }

  // salva preferência
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // storage pode falhar em modos restritos; silenciosamente ignoramos
      console.warn("Não foi possível salvar preferência de tema:", e);
    }
  }

  // recupera preferência (localStorage -> prefers-color-scheme -> default)
  function getSavedTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored && VALID_THEMES.includes(stored)) return stored;
    } catch (e) { /* ignore */ }

    // fallback: usar prefers-color-scheme: dark
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (e) { /* ignore */ }

    return "light";
  }

  // ciclo de temas (light -> dark -> high-contrast -> light)
  function nextTheme(current) {
    if (!current) current = getSavedTheme();
    const idx = VALID_THEMES.indexOf(current);
    if (idx === -1) return "dark";
    return VALID_THEMES[(idx + 1) % VALID_THEMES.length];
  }

  // inicializa controle no DOM — adiciona listeners e atalho de teclado
  function initThemeControl() {
    const btn = document.getElementById("themeToggle");
    const status = document.getElementById("themeStatus");

    // se o botão não existir, não fazemos nada (o HTML deve conter o botão)
    if (!btn) return;

    // aplicar preferência salv a inicial
    const initial = getSavedTheme();
    applyTheme(initial);

    // clique: alterna para próximo tema
    btn.addEventListener("click", (e) => {
      const current = getSavedTheme();
      const next = nextTheme(current);
      applyTheme(next);
      saveTheme(next);
    });

    // acesso por teclado: suporte a teclas C,D,H para usuários avançados (document-level)
    document.addEventListener("keydown", (ev) => {
      // evitar quando o usuário estiver editando input/textarea/contenteditable
      const tag = (ev.target && ev.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || ev.target.isContentEditable) return;

      if (ev.key === "c" || ev.key === "C") {
        applyTheme("light"); saveTheme("light");
      } else if (ev.key === "d" || ev.key === "D") {
        applyTheme("dark"); saveTheme("dark");
      } else if (ev.key === "h" || ev.key === "H") {
        applyTheme("high-contrast"); saveTheme("high-contrast");
      }
    });

    // rolagem de foco — garantir foco visível no botão via teclado
    btn.addEventListener("keyup", (e) => {
      if (e.key === " " || e.key === "Enter") {
        btn.click();
      }
    });

    // expõe status inicial para leitores de tela
    if (status) {
      status.textContent = `Tema ativo: ${themeLabel[getSavedTheme()] || "Padrão"}`;
    }
  }

  /* ==========================
     FIM THEME HANDLER
     ========================== */

  /* ==========================
     Código original (masks, validação, SPA)
     Preservado do seu script original e mantido abaixo.
     (Não modifiquei a lógica funcional; apenas acrescentei chamadas de initThemeControl)
     ========================== */

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function safeText(node, txt) {
    if (!node) return;
    node.textContent = txt;
  }

  function createErrorMessage(message) {
    const el = document.createElement("small");
    el.className = "field-error";
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "polite");
    el.textContent = message;
    return el;
  }

  function findClosestFormFieldEl(input) {
    // inputs/selects are direct; we will insert after the input element itself
    return input;
  }

  function mask(el, fn) {
    if (!el) return;
    if (el.dataset.maskInitialized === "true") return;
    el.addEventListener("input", e => e.target.value = fn(e.target.value));
    el.dataset.maskInitialized = "true";
  }

  const cpfMask = v => v.replace(/\D/g,"")
                         .replace(/(\d{3})(\d)/, "$1.$2")
                         .replace(/(\d{3})(\d)/, "$1.$2")
                         .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const telMask = v => v.replace(/\D/g,"")
                         .replace(/(\d{2})(\d)/, "($1) $2")
                         .replace(/(\d{5})(\d{4})$/, "$1-$2");

  const cepMask = v => v.replace(/\D/g,"")
                         .replace(/(\d{5})(\d{3})$/, "$1-$2");

  function initMasks(root = document) {
    const cpfEl = qs("#cpf", root);
    const telEl = qs("#telefone", root);
    const cepEl = qs("#cep", root);

    if (cpfEl) mask(cpfEl, cpfMask);
    if (telEl) mask(telEl, telMask);
    if (cepEl) mask(cepEl, cepMask);
  }

  function updateAno(root = document) {
    const ano = qs("#ano", root);
    if (ano) ano.textContent = new Date().getFullYear();
  }

  function getErrorMessageForField(field) {
    const name = field.getAttribute("name") || field.id || "Campo";
    
    if (field.validity.valueMissing) {
      return `${labelTextFor(field)} é obrigatório`;
    }
    if (field.validity.typeMismatch) {
      return `${labelTextFor(field)} tem formato inválido`;
    }
    if (field.validity.tooShort) {
      return `${labelTextFor(field)} está muito curto`;
    }
    if (field.validity.patternMismatch) {
      
      if (field.id === "cpf") return "Formato de CPF inválido";
      if (field.id === "telefone") return "Formato de telefone inválido";
      if (field.id === "cep") return "Formato de CEP inválido";
      return `${labelTextFor(field)} está em formato inválido`;
    }
    return `${labelTextFor(field)} inválido`;
  }

  function labelTextFor(field) {
    
    try {
      const id = field.id;
      if (id) {
        const lab = document.querySelector(`label[for="${id}"]`);
        if (lab && lab.textContent) return lab.textContent.replace(/:$/,"").trim();
      }
    
      if (field.name) return field.name.replace(/[_-]/g," ");
      return "Campo";
    } catch(e) {
      return "Campo";
    }
  }

  function showFieldError(field, message) {
    if (!field) return;
    
    const container = findClosestFormFieldEl(field);
    
    removeFieldError(field);

    const msgEl = createErrorMessage(message);
    msgEl.classList.add("error-message-js");

    field.setAttribute("aria-invalid", "true");

    const next = container.nextElementSibling;
    if (next && next.tagName.toLowerCase() === "small" && !next.classList.contains("field-error")) {
      next.parentNode.insertBefore(msgEl, next.nextSibling);
    } else {
      container.parentNode.insertBefore(msgEl, container.nextSibling);
    }

    field.classList.add("invalid");
  }

  function removeFieldError(field) {
    if (!field) return;
    field.setAttribute("aria-invalid", "false");
    field.classList.remove("invalid");
    // remove any error message small right after field
    const candidate = field.nextElementSibling;
    if (candidate && candidate.classList && (candidate.classList.contains("field-error") || candidate.classList.contains("error-message-js"))) {
      candidate.remove();
    } else {
      // maybe help small then error small
      const next2 = candidate ? candidate.nextElementSibling : null;
      if (next2 && next2.classList && (next2.classList.contains("field-error") || next2.classList.contains("error-message-js"))) {
        next2.remove();
      }
    }
  }

  function validateField(field) {
    if (!field || (field.tagName.toLowerCase() !== "input" && field.tagName.toLowerCase() !== "select" && field.tagName.toLowerCase() !== "textarea")) return true;
    // only validate required fields and those with pattern etc.
    if (field.disabled) {
      removeFieldError(field);
      return true;
    }

    const valid = field.checkValidity();
    if (!valid) {
      const msg = getErrorMessageForField(field);
      showFieldError(field, msg);
      return false;
    } else {
      removeFieldError(field);
      return true;
    }
  }

  function attachRealTimeValidation(form) {
    if (!form) return;
    if (form.dataset.validationInitialized === "true") return;
    const fields = qsa("input[required], select[required], textarea[required]", form);

    fields.forEach(field => {
      // initialize aria-invalid attribute
      if (!field.hasAttribute("aria-invalid")) field.setAttribute("aria-invalid", "false");

      // blur listener
      const onBlur = () => validateField(field);
      field.addEventListener("blur", onBlur);

      // also validate on input to clear errors as user types (but don't be noisy)
      const onInput = () => {
        if (field.classList.contains("invalid")) validateField(field);
      };
      field.addEventListener("input", onInput);
    });

    // Submit handler
    const submitHandler = (e) => {
      // run validation for all required fields
      const allFields = qsa("input, select, textarea", form);
      let allValid = true;
      allFields.forEach(f => {
        const ok = validateField(f);
        if (!ok) allValid = false;
      });

      if (!allValid) {
        e.preventDefault();
        // focus first invalid field
        const firstInvalid = qs(".invalid", form);
        if (firstInvalid && typeof firstInvalid.focus === "function") firstInvalid.focus();
        alert("Verifique os campos destacados ❗");
        return false;
      } else {
        e.preventDefault();
        form.reset();
        // remove any lingering error messages
        qsa(".field-error, .error-message-js", form).forEach(n => n.remove());
        // reset aria-invalid
        qsa("[aria-invalid='true']", form).forEach(n => n.setAttribute("aria-invalid", "false"));
        alert("Cadastro enviado com sucesso ✅");
        return true;
      }
    };

    form.addEventListener("submit", submitHandler);
    // mark initialized
    form.dataset.validationInitialized = "true";
  }

  function initCadastroPage(root = document) {
    // Only run if cadastro form exists
    const form = qs("#cadastroForm", root);
    if (!form) return;
    attachRealTimeValidation(form);
    initMasks(root);
  }


  // Replace top-level first <div> inside body with new content's first <div>
  function replaceMainDiv(newDoc) {
    const newDiv = newDoc.body.querySelector("div");
    if (!newDiv) return false;

    const currentDiv = document.body.querySelector("div");
    if (!currentDiv) return false;


    const newClone = newDiv.cloneNode(true);
    currentDiv.replaceWith(newClone);
    return true;
  }

  function updateTitleAndMeta(newDoc) {
    // title
    const newTitle = newDoc.querySelector("title");
    if (newTitle && newTitle.textContent) {
      document.title = newTitle.textContent;
    }
  }

  function setActiveNav() {
    // update aria-current on nav links that match location.pathname
    const navLinks = qsa("a[href]");
    navLinks.forEach(a => {
      try {
        const hrefAttr = a.getAttribute("href");
        // ignore fragment-only links
        if (!hrefAttr) return;
        const resolved = new URL(hrefAttr, location.href);
        // compare only pathname (ignore trailing slash differences)
        const normalize = p => p.replace(/\/+$/, "");
        if (normalize(resolved.pathname) === normalize(location.pathname)) {
          a.setAttribute("aria-current", "page");
        } else {
          a.removeAttribute("aria-current");
        }
      } catch (e) {
        // ignore invalid URLs
      }
    });
  }

  async function fetchPage(href, opts = { push: true }) {
    // href can be relative or absolute; resolve it
    const resolved = new URL(href, location.href);
    const fetchPath = resolved.pathname + resolved.search; // omit hash when fetching

    try {
      const res = await fetch(fetchPath, { cache: "no-store" });
      if (!res.ok) {
        console.error("Falha ao carregar página:", res.status);
        return;
      }
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      // Replace main div
      const ok = replaceMainDiv(doc);
      if (!ok) {
        console.warn("Não foi possível encontrar <div> para substituir.");
        return;
      }

      // Update title
      updateTitleAndMeta(doc);

      // Update URL
      if (opts.push) {
        // push new state with full href including hash
        const toPush = resolved.pathname + resolved.search + resolved.hash;
        history.pushState({}, "", toPush);
      } else {
        // replace state (used by popstate loader)
        const toReplace = resolved.pathname + resolved.search + resolved.hash;
        history.replaceState({}, "", toReplace);
      }

      // After DOM replacement, run initializers on the new content
      initGlobal();

      // set aria-current on nav links
      setActiveNav();

      // if there's a hash, attempt to scroll to it
      if (resolved.hash) {
        const id = resolved.hash.substring(1);
        // small timeout to ensure element exists after render
        setTimeout(() => {
          const target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      } else {
        // scroll to top of main content
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

    } catch (err) {
      console.error("Erro ao carregar página SPA:", err);
    }
  }

  function shouldHandleLinkClick(a) {
    if (!a) return false;
    const hrefAttr = a.getAttribute("href");
    if (!hrefAttr) return false;
    // If it's a fragment-only link (#...), don't intercept
    if (hrefAttr.startsWith("#")) return false;

    // If target="_blank" or has download attribute, skip
    if (a.target && a.target === "_blank") return false;
    if (a.hasAttribute("download")) return false;

    // If link is external (different origin), skip
    try {
      const url = new URL(hrefAttr, location.href);
      if (url.origin !== location.origin) return false;
    } catch (e) {
      return false;
    }

    // Only handle .html pages (or paths that look like pages)
    // We'll handle links that end with .html or have no extension but point to same origin.
    // For safety, handle links whose pathname ends with '.html' OR whose href contains '.html'
    if (hrefAttr.includes(".html") || hrefAttr.endsWith("/") || hrefAttr.includes("?") || !hrefAttr.includes("://")) {
      return true;
    }
    return true;
  }

  function attachLinkInterceptor(root = document) {
    // Use delegated listener on document to capture future links too
    // But to keep easy removal/avoid duplicates, ensure we add only once.
    if (document.body.dataset.linkInterceptor === "true") return;

    document.addEventListener("click", (ev) => {
      const a = ev.target.closest && ev.target.closest("a[href]");
      if (!a) return;
      if (!shouldHandleLinkClick(a)) return;

      // get href attribute (not resolved href), so fragments considered
      const hrefAttr = a.getAttribute("href");
      // Prevent default and handle SPA navigation
      ev.preventDefault();
      fetchPage(hrefAttr, { push: true });
    });

    document.body.dataset.linkInterceptor = "true";
  }

  /* =========================
     Initialization (global)
  ========================= */

  function initGlobal() {
    // Update year
    updateAno(document);

    // Init masks within current document content
    initMasks(document);

    // Init cadastro if present
    initCadastroPage(document);

    // Attach link interceptor for SPA navigation
    attachLinkInterceptor(document);

    // Set aria-current on nav links
    setActiveNav();

    // Init theme control (important: after DOM content exists)
    initThemeControl();

    // Handle popstate (only attach once)
    if (!window._spaPopstateAttached) {
      window.addEventListener("popstate", (e) => {
        // Load current location without pushing
        // Use location.pathname + location.search + location.hash
        const full = location.pathname + location.search + location.hash;
        fetchPage(full, { push: false });
      });
      window._spaPopstateAttached = true;
    }
  }

  /* =========================
     On initial load
  ========================= */

  document.addEventListener("DOMContentLoaded", () => {
    // Ensure initial history state is consistent (replaceState)
    history.replaceState({}, "", location.pathname + location.search + location.hash);

    initGlobal();
  });

})();
