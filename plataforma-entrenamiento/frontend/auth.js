/**
 * FitCoach Pro – Control de sesión (frontend)
 * Solo para el taller de Clarity en Netlify.
 * Más adelante se reemplazará por autenticación real en el backend.
 */

(function () {
  const PAGINAS_PRIVADAS = [
    'entrenamiento.html',
    'nutricion.html',
    'recompensas.html'
  ];

  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

  function obtenerSesion() {
    try {
      return JSON.parse(localStorage.getItem('fitcoach_sesion'));
    } catch {
      return null;
    }
  }

  function cerrarSesion() {
    localStorage.removeItem('fitcoach_sesion');
    window.location.href = 'login.html';
  }

  // Proteger páginas privadas
  if (PAGINAS_PRIVADAS.includes(paginaActual)) {
    const sesion = obtenerSesion();
    if (!sesion) {
      window.location.href = 'login.html';
      return;
    }
  }

  // Actualizar la barra de navegación y hero según sesión
  document.addEventListener('DOMContentLoaded', () => {
    const sesion = obtenerSesion();
    const nav = document.querySelector('.navbar');

    // --- Navbar ---
    if (nav) {
      const botonDerecha = nav.querySelector('.btn-primary.btn-sm, .btn.btn-primary.btn-sm');

      if (sesion) {
        if (botonDerecha) {
          botonDerecha.textContent = 'Cerrar sesión';
          botonDerecha.href = '#';
          botonDerecha.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
          });
        }

        const brand = nav.querySelector('.nav-brand');
        if (brand && !document.querySelector('.nav-user')) {
          const userSpan = document.createElement('span');
          userSpan.className = 'nav-user';
          userSpan.style.cssText = 'margin-left:1rem;font-size:0.85rem;color:var(--text-muted);';
          userSpan.textContent = 'Hola, ' + (sesion.nombre || 'Atleta');
          brand.after(userSpan);
        }
      } else {
        if (botonDerecha) {
          botonDerecha.href = 'login.html';
          botonDerecha.textContent = 'Iniciar sesión';
        }
      }
    }

    // --- Hero de index: tarjeta pública vs privada ---
    const cardPublico = document.getElementById('heroCardPublico');
    const cardPrivado = document.getElementById('heroCardPrivado');
    if (cardPublico && cardPrivado) {
      if (sesion) {
        cardPublico.style.display = 'none';
        cardPrivado.style.display = 'block';
      } else {
        cardPublico.style.display = 'block';
        cardPrivado.style.display = 'none';
      }
    }
  });

  // Exponer función por si se necesita
  window.fitcoachCerrarSesion = cerrarSesion;
})();
