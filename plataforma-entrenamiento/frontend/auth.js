/**
 * FitCoach Pro – Control de sesión, gestión de roles (frontend RBAC) e Interceptor JWT 401
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

  // Interceptor de peticiones HTTP para manejar tokens JWT expirados (401 Unauthorized)
  const fetchOriginal = window.fetch;
  if (fetchOriginal) {
    window.fetch = async function (...args) {
      const respuesta = await fetchOriginal.apply(this, args);
      if (respuesta && respuesta.status === 401) {
        console.warn('Sesión expirada o token inválido (401 Unauthorized). Redirigiendo a login...');
        localStorage.removeItem('fitcoach_sesion');
        if (paginaActual !== 'login.html') {
          window.location.href = 'login.html';
        }
      }
      return respuesta;
    };
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

    if (sesion) {
      const rolActual = sesion.rol || 'atleta';
      const esAdmin = rolActual === 'admin' || rolActual === 'super_admin';
      const esSuperAdmin = rolActual === 'super_admin';
      const esCoach = rolActual === 'coach' || esAdmin;

      // Ocultamiento Dinámico de Elementos según RBAC
      document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = esAdmin ? '' : 'none';
      });
      document.querySelectorAll('.super-admin-only').forEach(el => {
        el.style.display = esSuperAdmin ? '' : 'none';
      });
      document.querySelectorAll('.coach-only').forEach(el => {
        el.style.display = esCoach ? '' : 'none';
      });

      // --- Navbar ---
      if (nav) {
        const botonDerecha = nav.querySelector('.btn-primary.btn-sm, .btn.btn-primary.btn-sm');

        const rolTexto = {
          'atleta': 'Atleta',
          'coach': 'Coach',
          'admin': 'Admin',
          'super_admin': 'SuperAdmin'
        }[rolActual] || 'Atleta';

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
            const labelAdmin = esSuperAdmin ? '⚡ Panel SuperAdmin' : '🛡️ Panel Admin';
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
      }
    } else {
      if (nav) {
        const botonDerecha = nav.querySelector('.btn-primary.btn-sm, .btn.btn-primary.btn-sm');
        if (botonDerecha) {
          botonDerecha.href = 'login.html';
          botonDerecha.textContent = 'Iniciar sesión';
        }
      }

      // Ocultar elementos de administración si no hay sesión
      document.querySelectorAll('.admin-only, .super-admin-only, .coach-only').forEach(el => {
        el.style.display = 'none';
      });
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
