(function () {
  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");

  if (!form || !status) return;

  const fields = {
    nombre: form.querySelector("#nombre"),
    email: form.querySelector("#email"),
    destino: form.querySelector("#destino"),
    mensaje: form.querySelector("#mensaje")
  };

  const isEmailValid = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const setFeedback = (input, valid, message = "") => {
    if (valid) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }

    let feedback = input.parentElement.querySelector(".invalid-feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.className = "invalid-feedback";
      input.parentElement.appendChild(feedback);
    }

    feedback.textContent = valid ? "" : message;
  };

  const validateField = (input) => {
    const value = input.value.trim();
    let valid = true;
    let message = "";

    if (input.id === "nombre") {
      if (!value) {
        valid = false;
        message = "Ingresa tu nombre para continuar.";
      } else if (value.length < 2) {
        valid = false;
        message = "El nombre debe tener al menos 2 caracteres.";
      }
    }

    if (input.id === "email") {
      if (!value) {
        valid = false;
        message = "Ingresa tu correo electrónico.";
      } else if (!isEmailValid(value)) {
        valid = false;
        message = "Ingresa un correo con formato válido.";
      }
    }

    if (input.id === "destino") {
      if (!value) {
        valid = false;
        message = "Selecciona un destino de interés.";
      }
    }

    if (input.id === "mensaje") {
      if (!value) {
        valid = false;
        message = "Escribe un mensaje para describir tu viaje.";
      } else if (value.length < 12) {
        valid = false;
        message = "El mensaje debe tener al menos 12 caracteres.";
      }
    }

    setFeedback(input, valid, message);
    return valid;
  };

  const validateForm = () => {
    const validFields = Object.values(fields).map(validateField);
    return validFields.every(Boolean);
  };

  const setFormStatus = (message, type) => {
    status.textContent = message;
    status.className = type === "success" ? "contact-form__status text-success" : "contact-form__status text-danger";
  };

  const clearValidation = () => {
    Object.values(fields).forEach((input) => {
      input.classList.remove("is-invalid", "is-valid");
      const feedback = input.parentElement.querySelector(".invalid-feedback");
      if (feedback) {
        feedback.textContent = "";
      }
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      setFormStatus("Revisa los campos antes de enviar el formulario.", "error");
      return;
    }

    setFormStatus("Gracias. Tu solicitud se ha enviado con éxito.", "success");
    form.reset();
    clearValidation();
  });

  Object.values(fields).forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.trim()) {
        validateField(input);
      } else {
        input.classList.remove("is-invalid", "is-valid");
        const feedback = input.parentElement.querySelector(".invalid-feedback");
        if (feedback) {
          feedback.textContent = "";
        }
      }
    });
  });
})();
