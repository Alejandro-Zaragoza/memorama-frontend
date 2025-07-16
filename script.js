window.onload = () => {
  const userId = localStorage.getItem('userId');

  // Mostrar botón para jugar si el usuario está logueado
  const seccionJuego = document.getElementById('seccion-juego');
  if (userId && seccionJuego) {
    seccionJuego.style.display = 'block';
  }

  // Cargar tabla de puntuaciones
  const tabla = document.getElementById('tabla-puntuaciones');
  if (tabla) {
    fetch('https://memorama-backend.onrender.com/api/scores')
      .then(res => res.json())
      .then(data => {
        data.forEach(row => {
          tabla.innerHTML += `
            <tr>
              <td>${row.nombre}</td>
              <td>${row.puntos}</td>
              <td>${new Date(row.fecha).toLocaleString()}</td>
            </tr>`;
        });
      })
      .catch(err => {
        console.error('Error al obtener puntuaciones:', err);
      });
  }
};

// Botón para cerrar sesión
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    alert('Sesión cerrada');
    window.location.href = 'index.html';
  });
}

// Cerrar sesión desde game.html
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    alert('Sesión cerrada');
    window.location.href = 'index.html';
  });
}
