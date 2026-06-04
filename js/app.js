(function () {
  const storageKeyFavorites = "destinoBoliviaFavoritos";
  const navLinks = document.querySelectorAll(".site-nav .nav-link");
  const navbar = document.querySelector(".site-nav");

  const getPageName = () => window.location.pathname.split("/").pop() || "index.html";

  const getLocalStorage = (key, fallback = []) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getValidFavoriteIds = () => {
    const favoriteIds = getLocalStorage(storageKeyFavorites, []);
    if (!Array.isArray(favoriteIds)) return [];
    if (!Array.isArray(window.destinosBolivia)) return favoriteIds;

    const validIds = new Set(window.destinosBolivia.map((destination) => destination.id));
    return favoriteIds.filter((id) => validIds.has(id));
  };

  const highlightActiveLink = () => {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === getPageName()) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const updateNavbarState = () => {
    if (!navbar) return;
    navbar.classList.toggle("site-nav--scrolled", window.scrollY > 12);
  };

  const createFavoriteBadge = () => {
    const favoriteLink = Array.from(navLinks).find((link) => link.getAttribute("href") === "favoritos.html");
    if (!favoriteLink) return null;

    let badge = favoriteLink.querySelector(".favorite-count-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "favorite-count-badge badge bg-light text-dark ms-2 visually-hidden";
      badge.setAttribute("aria-live", "polite");
      favoriteLink.appendChild(badge);
    }

    return badge;
  };

  const renderFavoriteCount = () => {
    const favoriteIds = getValidFavoriteIds();
    const badge = createFavoriteBadge();
    if (!badge) return;

    if (!favoriteIds.length) {
      badge.classList.add("visually-hidden");
      badge.textContent = "0";
      return;
    }

    badge.classList.remove("visually-hidden");
    badge.textContent = favoriteIds.length;
  };

  const renderDestinationsCount = () => {
    const countNode = document.querySelector("#destinationsCount");
    if (!countNode || !Array.isArray(window.destinosBolivia)) return;

    countNode.textContent = `${window.destinosBolivia.length} destinos recomendados`;
  };

  const init = () => {
    highlightActiveLink();
    updateNavbarState();
    window.addEventListener("scroll", updateNavbarState, { passive: true });
    renderFavoriteCount();
    renderDestinationsCount();
  };

  window.DestinoBolivia = {
    getLocalStorage,
    setLocalStorage,
    renderFavoriteCount,
    renderDestinationsCount,
    getCurrentFavorites: getValidFavoriteIds,
    getDestinoById: (id) => Array.isArray(window.destinosBolivia) ? window.destinosBolivia.find((item) => item.id === id) : undefined
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
