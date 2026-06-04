(function () {
  const storageKey = "destinoBoliviaFavoritos";
  const favoriteButtonsSelector = ".js-favorite";

  const getFavoritesContainer = () => document.querySelector("#favoritesContainer");
  const getPageName = () => window.location.pathname.split("/").pop() || "index.html";

  const getFavorites = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem(storageKey));
      if (!Array.isArray(favorites)) return [];
      if (!Array.isArray(window.destinosBolivia)) return favorites;

      const validIds = new Set(window.destinosBolivia.map((destination) => destination.id));
      return favorites.filter((id) => validIds.has(id));
    } catch {
      return [];
    }
  };

  const saveFavorites = (items) => {
    localStorage.setItem(storageKey, JSON.stringify([...new Set(items)]));
  };

  const isFavorite = (id) => getFavorites().includes(id);

  const refreshFavoriteCount = () => {
    window.DestinoBolivia?.renderFavoriteCount?.();
  };

  const getDestinationName = (button) => {
    return button.dataset.destinationName
      || button.closest(".destination-card")?.querySelector(".destination-card__title")?.textContent?.trim()
      || "destino";
  };

  const updateFavoriteButton = (button) => {
    const id = button.dataset.destinationId || button.closest("[data-destination-id]")?.dataset.destinationId;
    if (!id) return;

    const active = isFavorite(id);
    const destinationName = getDestinationName(button);

    button.classList.toggle("is-active", active);
    button.innerHTML = `<i class="bi ${active ? "bi-heart-fill" : "bi-heart"}" aria-hidden="true"></i>`;
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? `Quitar ${destinationName} de favoritos` : `Agregar ${destinationName} a favoritos`);
  };

  const updateAllFavoriteButtons = () => {
    document.querySelectorAll(favoriteButtonsSelector).forEach(updateFavoriteButton);
  };

  const renderFavoritesPage = () => {
    const favoritesContainer = getFavoritesContainer();
    if (!favoritesContainer) return;

    const favoriteIds = getFavorites();
    if (!favoriteIds.length) {
      favoritesContainer.innerHTML = `
        <div class="favorites-shell__empty text-center">
          <div class="favorites-shell__icon" aria-hidden="true"><i class="bi bi-heart"></i></div>
          <h2>Aún no hay destinos guardados</h2>
          <p>Agrega destinos a favoritos y vuelve a encontrarlos aquí.</p>
          <a class="btn btn-brand" href="destinos.html">Explorar destinos</a>
        </div>
      `;
      return;
    }

    const cards = favoriteIds
      .map((id) => window.DestinoBolivia?.getDestinoById?.(id))
      .filter(Boolean)
      .map((destination) => `
        <article class="destination-card favorite-card" data-destination-id="${destination.id}">
          <img class="destination-card__image" src="${destination.imagen}" alt="${destination.nombre}">
          <div class="destination-card__body">
            <h2 class="destination-card__title">${destination.nombre}</h2>
            <p class="destination-card__location">${destination.ubicacion}</p>
            <p class="destination-card__text">${destination.descripcion}</p>
            <button class="btn btn-outline-brand btn-sm js-remove-favorite" type="button" data-destination-id="${destination.id}">Eliminar de favoritos</button>
          </div>
        </article>
      `)
      .join("");

    favoritesContainer.innerHTML = `<div class="favorites-list">${cards}</div>`;
  };

  const removeFavorite = (id) => {
    if (!id) return;
    saveFavorites(getFavorites().filter((item) => item !== id));
    refreshFavoriteCount();
    updateAllFavoriteButtons();
    renderFavoritesPage();
  };

  const addFavorite = (id) => {
    if (!id) return;
    const favorites = getFavorites();
    if (!favorites.includes(id)) {
      saveFavorites([...favorites, id]);
    }
    refreshFavoriteCount();
    updateAllFavoriteButtons();
    renderFavoritesPage();
  };

  const toggleFavorite = (id) => {
    if (isFavorite(id)) {
      removeFavorite(id);
      return;
    }

    addFavorite(id);
  };

  const handleDocumentClick = (event) => {
    const favoriteButton = event.target.closest(favoriteButtonsSelector);
    if (favoriteButton) {
      const id = favoriteButton.dataset.destinationId || favoriteButton.closest("[data-destination-id]")?.dataset.destinationId;
      toggleFavorite(id);
      return;
    }

    const removeButton = event.target.closest(".js-remove-favorite");
    if (removeButton) {
      removeFavorite(removeButton.dataset.destinationId);
    }
  };

  const init = () => {
    // CORRECCIÓN: Se eliminó el bloque que vaciaba el localStorage en destinos.html
    updateAllFavoriteButtons();
    renderFavoritesPage();
    refreshFavoriteCount();
  };

  document.addEventListener("click", handleDocumentClick);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();