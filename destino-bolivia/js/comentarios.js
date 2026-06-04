(function () {
  const storageKey = "destinoBoliviaComentarios";
  const commentsSection = document.querySelector(".comments-shell");
  const destinationId = document.body.dataset.destinoId;

  if (!commentsSection || !destinationId) return;

  const getRawComments = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  };

  const saveRawComments = (data) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const getComments = () => {
    const store = getRawComments();
    return Array.isArray(store[destinationId]) ? store[destinationId] : [];
  };

  const saveComments = (comments) => {
    const store = getRawComments();
    store[destinationId] = comments;
    saveRawComments(store);
  };

  const escapeHtml = (value) => {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const buildStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => `<span class="comment-star ${index < rating ? "comment-star--active" : ""}">★</span>`).join("");
  };

  const renderCommentForm = () => {
    const body = commentsSection.querySelector(".comments-shell__body");
    if (!body) return;

    body.innerHTML = `
      <div class="comments-action">
        <form class="comments-form glass-panel" id="commentForm" novalidate>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label" for="commentName">Nombre</label>
              <input class="form-control" type="text" id="commentName" name="commentName" placeholder="Tu nombre">
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label" for="commentRating">Puntuación</label>
              <select class="form-select" id="commentRating" name="commentRating">
                <option value="0">Selecciona una opción</option>
                <option value="1">1 estrella</option>
                <option value="2">2 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="5">5 estrellas</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label" for="commentText">Comentario</label>
              <textarea class="form-control" id="commentText" name="commentText" rows="4" placeholder="Comparte tu experiencia"></textarea>
            </div>
            <div class="col-12">
              <button class="btn btn-brand w-100" type="submit">Enviar comentario</button>
            </div>
            <div class="col-12">
              <p class="comment-status mt-2" id="commentStatus" aria-live="polite"></p>
            </div>
          </div>
        </form>
      </div>
      <div class="comments-list mt-4" id="commentsList"></div>
    `;
  };

  const renderCommentsList = () => {
    const list = document.querySelector("#commentsList");
    if (!list) return;

    const comments = getComments();
    if (!comments.length) {
      list.innerHTML = `
        <div class="comments-empty glass-panel text-center">
          <p>Aun no hay opiniones para este destino. Sé el primero en compartir tu experiencia.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = comments
      .map((comment) => {
        return `
          <article class="comment-card glass-panel">
            <div class="comment-card__header d-flex justify-content-between align-items-center">
              <strong>${escapeHtml(comment.name)}</strong>
              <small class="text-muted">${formatDate(comment.date)}</small>
            </div>
            <div class="comment-card__rating mb-2">${buildStars(comment.rating)} <span class="text-muted">${comment.rating}/5</span></div>
            <p>${escapeHtml(comment.text)}</p>
          </article>
        `;
      })
      .join("");
  };

  const setFieldError = (field, message) => {
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
    let feedback = field.parentElement.querySelector(".invalid-feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.className = "invalid-feedback";
      field.parentElement.appendChild(feedback);
    }
    feedback.textContent = message;
  };

  const clearFieldError = (field) => {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
    const feedback = field.parentElement.querySelector(".invalid-feedback");
    if (feedback) {
      feedback.textContent = "";
    }
  };

  const validateField = (field) => {
    const value = field.value.trim();
    let valid = true;
    let message = "";

    if (field.id === "commentName") {
      if (!value) {
        valid = false;
        message = "Escribe tu nombre para dejar tu comentario.";
      } else if (value.length < 2) {
        valid = false;
        message = "El nombre debe tener al menos 2 caracteres.";
      }
    }

    if (field.id === "commentRating") {
      if (!value || value === "0") {
        valid = false;
        message = "Selecciona una puntuación.";
      }
    }

    if (field.id === "commentText") {
      if (!value) {
        valid = false;
        message = "Escribe un comentario para compartir tu experiencia.";
      } else if (value.length < 12) {
        valid = false;
        message = "Tu comentario debe tener al menos 12 caracteres.";
      }
    }

    if (!valid) {
      setFieldError(field, message);
    } else {
      clearFieldError(field);
    }

    return valid;
  };

  const validateForm = () => {
    const inputs = [
      document.querySelector("#commentName"),
      document.querySelector("#commentRating"),
      document.querySelector("#commentText")
    ];

    return inputs.every((field) => validateField(field));
  };

  const showStatus = (message, type = "error") => {
    const status = document.querySelector("#commentStatus");
    if (!status) return;
    status.textContent = message;
    status.className = type === "success" ? "comment-status mt-2 text-success" : "comment-status mt-2 text-danger";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showStatus("Por favor completa los campos antes de enviar el comentario.", "error");
      return;
    }

    const nameField = document.querySelector("#commentName");
    const ratingField = document.querySelector("#commentRating");
    const textField = document.querySelector("#commentText");

    const newComment = {
      id: Date.now().toString(),
      name: nameField.value.trim(),
      rating: Number(ratingField.value),
      text: textField.value.trim(),
      date: new Date().toISOString()
    };

    const comments = [newComment, ...getComments()];
    saveComments(comments);
    renderCommentsList();
    nameField.value = "";
    ratingField.value = "0";
    textField.value = "";
    nameField.classList.remove("is-valid");
    ratingField.classList.remove("is-valid");
    textField.classList.remove("is-valid");
    showStatus("Comentario agregado correctamente.", "success");
  };

  const attachFormHandlers = () => {
    const form = document.querySelector("#commentForm");
    if (!form) return;

    [
      document.querySelector("#commentName"),
      document.querySelector("#commentRating"),
      document.querySelector("#commentText")
    ].forEach((field) => {
      if (!field) return;
      field.addEventListener("input", () => validateField(field));
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", handleSubmit);
  };

  const init = () => {
    renderCommentForm();
    renderCommentsList();
    attachFormHandlers();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
