const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');
const tablero = document.getElementById('tablero');
const estado = document.getElementById('estado');
const jugadorNombre = document.getElementById('jugador-nombre');

if (!userId || !userName) {
  alert('Debes iniciar sesión para jugar.');
  window.location.href = 'login.html';
}

jugadorNombre.textContent = userName;

let cartas = [];
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;
let aciertos = 0;
let juegoTerminado = false; // <--- NUEVA BANDERA

function generarCartas() {
  const valores = ['🐶', '🐱', '🐭', '🐹', '🦊', '🐰', '🐼', '🐨'];
  const duplicadas = [...valores, ...valores];
  const barajadas = duplicadas.sort(() => Math.random() - 0.5);
  return barajadas;
}

function crearTablero() {
  cartas = [];
  tablero.innerHTML = '';
  aciertos = 0;
  estado.innerText = '';
  primeraCarta = null;
  segundaCarta = null;
  bloqueo = false;
  juegoTerminado = false; // <--- REINICIA BANDERA

  const valores = generarCartas();

  valores.forEach((valor, index) => {
    const div = document.createElement('div');
    div.classList.add('carta');
    div.dataset.valor = valor;
    div.dataset.index = index;
    div.innerText = '❓';

    div.addEventListener('click', manejarClickCarta);

    tablero.appendChild(div);
    cartas.push(div);
  });
}

function manejarClickCarta(e) {
  if (bloqueo || juegoTerminado) return; // <--- NO PERMITIR SI TERMINÓ

  const carta = e.currentTarget;
  const valor = carta.dataset.valor;

  if (carta.classList.contains('volteada')) return;

  carta.innerText = valor;
  carta.classList.add('volteada');

  if (!primeraCarta) {
    primeraCarta = carta;
  } else {
    segundaCarta = carta;
    bloqueo = true;

    if (primeraCarta.dataset.valor === segundaCarta.dataset.valor) {
      aciertos++;
      primeraCarta = null;
      segundaCarta = null;
      bloqueo = false;

      if (aciertos === 8) {
        juegoTerminado = true; // <--- TERMINA JUEGO
        estado.innerText = '🎉 ¡Ganaste! Enviando puntuación...';
        guardarPuntuacion(8);
      }
    } else {
      setTimeout(() => {
        primeraCarta.innerText = '❓';
        segundaCarta.innerText = '❓';
        primeraCarta.classList.remove('volteada');
        segundaCarta.classList.remove('volteada');
        primeraCarta = null;
        segundaCarta = null;
        bloqueo = false;
      }, 1000);
    }
  }
}

function guardarPuntuacion(puntos) {
  fetch('https://memorama-backend.onrender.com/api/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario_id: userId, puntos })
  })
    .then(res => res.json())
    .then(data => {
      if (data.scoreId) {
        estado.innerText = `✅ Puntuación guardada (${puntos} pts). ¡Buen trabajo, ${userName}!`;
      } else {
        estado.innerText = '❌ No se pudo guardar la puntuación.';
      }
    })
    .catch(err => {
      console.error('Error al guardar puntuación:', err);
      estado.innerText = '❌ Error al guardar puntuación.';
    });
}

// Botón reinicio manual
document.getElementById('reiniciar-btn').addEventListener('click', crearTablero);

// Botón logout
document.getElementById('logout-btn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Inicializar tablero
crearTablero();
