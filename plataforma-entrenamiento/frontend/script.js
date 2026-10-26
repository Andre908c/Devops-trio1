document.addEventListener('DOMContentLoaded', () => {
  console.log('FitCoach Pro cargado');

  // Efecto hover en tarjetas
  const cards = document.querySelectorAll('.feature-card, .step-card, .meal-card, .badge-card, .price-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'rgba(34, 211, 238, 0.4)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
    });
  });

  // Simulación de zona de subida
  const uploadZone = document.getElementById('uploadZone');
  if (uploadZone) {
    uploadZone.addEventListener('click', () => {
      alert('Simulación: aquí se abriría el selector de archivos para subir el video del entrenamiento.');
    });
  }

  // Botones de canjear recompensas
  document.querySelectorAll('.reward-item .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('¡Recompensa canjeada! (simulación para el taller de Clarity)');
    });
  });

  // Botones de planes
  document.querySelectorAll('.price-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Redirigiendo al proceso de suscripción... (simulación)');
    });
  });
});
