# Destino Bolivia 🇧🇴

Destino Bolivia es una plataforma web moderna, interactiva y totalmente responsiva diseñada para explorar, guardar y comentar sobre los destinos turísticos más emblemáticos de Bolivia. El proyecto combina maquetación semántica, el framework Bootstrap 5 para el diseño adaptativo y lógica avanzada en Vanilla JavaScript para ofrecer una experiencia de usuario (UX) fluida y persistente.

---

## 🚀 Características Principales

* **Catálogo de Destinos Responsivo:** Grid adaptable (`col-12 col-sm-6 col-xl-4`) que muestra tarjetas detalladas de los destinos con optimización de imágenes desde Unsplash.
* **Sistema de Favoritos Persistente:** Permite marcar y desmarcar destinos favoritos con retroalimentación visual instantánea (iconos cambiantes y estados de accesibilidad `aria-pressed`). Los datos persisten mediante `localStorage`, impidiendo que se borren al recargar la página o navegar por el sitio.
* **Contador Dinámico (Badge):** El menú de navegación genera e inyecta dinámicamente un contador con el número de destinos guardados en tiempo real.
* **Módulo de Comentarios e Historial por ID:** Sistema de reseñas por destino que almacena las opiniones de manera aislada en el navegador, ordenando las nuevas entradas cronológicamente.
* **Seguridad Integrada (Anti-XSS):** Filtro de escape de caracteres en el renderizado de comentarios para prevenir la inyección de código malicioso.
* **Formularios con Validación en Tiempo Real:** Tanto el formulario de contacto como el de opiniones validan los campos en paralelo (evitando bloqueos prematuros de flujo) y utilizan las clases de Bootstrap (`is-invalid`, `is-valid`) para dar feedback inmediato al usuario.
* **Efectos Visuales e Interacción:** Menú de navegación inteligente (`fixed-top`) que cambia su opacidad mediante scroll optimizado con eventos pasivos.

---

## 📁 Estructura del Proyecto

El proyecto está organizado de forma modular, separando la maquetación, los estilos y las responsabilidades lógicas:

```text
├── index.html                 # Página de inicio con destinos destacados
├── destinos.html              # Catálogo completo de experiencias turísticas
├── favoritos.html             # Panel de destinos guardados por el usuario
├── contacto.html              # Formulario de planificación de viajes
├── css/
│   ├── style.css              # Estilos base y variables globales del sitio
│   ├── animations.css         # Transiciones, microinteracciones y efectos de tarjetas
│   └── responsive.css         # Ajustes y media queries específicos
└── js/
    ├── data.js                # Repositorio central de datos de los destinos (Scope Global)
    ├── app.js                 # Núcleo de la aplicación, utilidades de almacenamiento y UI global
    ├── favoritos.js           # Gestión, persistencia y renderizado de la lista de favoritos
    ├── comentarios.js         # Lógica, validación y sanitización del sistema de reseñas
    └── formulario.js          # Control y validación del formulario de contacto general