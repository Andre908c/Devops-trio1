/**
 * FitCoach Pro – Control de sesión y gestión de roles (frontend)
 */

(function () {
  const PAGINAS_PRIVADAS = [
    'index.html',
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

  // Redirigir al login si no hay sesión iniciada (Flujo de pantalla inicial)
  const sesionInicial = obtenerSesion();
  if (!sesionInicial && (PAGINAS_PRIVADAS.includes(paginaActual) || paginaActual === '')) {
    if (paginaActual !== 'login.html' && paginaActual !== 'precios.html') {
      window.location.href = 'login.html';
      return;
    }
  }

  // Actualizar la barra de navegación y los paneles según el rol del usuario
  document.addEventListener('DOMContentLoaded', () => {
    const sesion = obtenerSesion();
    const nav = document.querySelector('.navbar');

    if (nav) {
      const botonDerecha = nav.querySelector('.btn-primary.btn-sm, .btn.btn-primary.btn-sm');

      if (sesion) {
        // Formatear rol para mostrar
        const rolTexto = {
          'atleta': 'Atleta',
          'coach': 'Coach',
          'admin': 'Admin',
          'super_admin': 'SuperAdmin'
        }[sesion.rol || 'atleta'] || 'Atleta';

        const esAdmin = sesion.rol === 'admin' || sesion.rol === 'super_admin';

        if (botonDerecha) {
          botonDerecha.textContent = 'Cerrar sesión';
          botonDerecha.href = '#';
          botonDerecha.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
          });
        }

        const brand = nav.querySelector('.nav-brand');
        if (brand && !document.querySelector('.nav-user-badge')) {
          const userContainer = document.createElement('div');
          userContainer.className = 'nav-user-badge';
          userContainer.style.cssText = 'display:inline-flex;align-items:center;gap:0.5rem;margin-left:1.5rem;font-size:0.85rem;color:var(--text);';

          let adminBadgeHtml = '';
          if (esAdmin) {
            const labelAdmin = sesion.rol === 'super_admin' ? '⚡ Panel SuperAdmin' : '🛡️ Panel Admin';
            adminBadgeHtml = `<span id="adminPanelBtn" style="background:#8b5cf6;color:#fff;padding:0.25rem 0.6rem;border-radius:12px;font-weight:bold;cursor:pointer;font-size:0.75rem;box-shadow:0 2px 6px rgba(139,92,246,0.4);">${labelAdmin}</span>`;
          }

          userContainer.innerHTML = `
            <span>Hola, <strong>${sesion.nombre || 'Usuario'}</strong></span>
            <span style="background:rgba(34,211,238,0.2);color:#22d3ee;padding:0.2rem 0.5rem;border-radius:10px;font-size:0.75rem;font-weight:600;">${rolTexto}</span>
            ${adminBadgeHtml}
          `;

          brand.after(userContainer);

          if (esAdmin) {
            const adminBtn = document.getElementById('adminPanelBtn');
            if (adminBtn) {
              adminBtn.addEventListener('click', () => {
                alert(`[${rolTexto}] Acceso al Panel de Control de Administración.\nPermisos activos: Gestión de Atletas, Coaches, Promociones y Logs del Sistema.`);
              });
            }
          }
        }
      } else {
        if (botonDerecha) {
          botonDerecha.href = 'login.html';
          botonDerecha.textContent = 'Iniciar sesión';
        }
      }
    }

    // Hero en index.html
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

  window.fitcoachCerrarSesion = cerrarSesion;
})();
