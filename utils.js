/* =============================================
   JaqueMáTICas — utils.js
   ============================================= */

/**
 * YouTube Façade: inyecta el iframe al hacer clic sobre la miniatura.
 * @param {HTMLElement} el  — el div.yt-facade clicado
 * @param {string}      id  — ID del vídeo de YouTube
 */
function ytPlay(el, id) {
  el.outerHTML =
    '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
    '?autoplay=1&rel=0" ' +
    'allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" ' +
    'allowfullscreen ' +
    'style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:8px;">' +
    '</iframe>';
}

/**
 * Mini Quiz: evalúa la respuesta seleccionada y actualiza la puntuación.
 * Marca con data-ok el botón correcto de cada pregunta.
 * @param {HTMLElement} btn     — botón pulsado
 * @param {boolean}     correct — si es la respuesta correcta
 */
function checkAnswer(btn, correct) {
  const opts = btn.closest('.quiz-opts');
  if (opts.dataset.answered) return;   // ya contestada
  opts.dataset.answered = '1';

  if (correct) {
    btn.classList.add('q-ok');
  } else {
    btn.classList.add('q-no');
    opts.querySelectorAll('[data-ok]').forEach(b => b.classList.add('q-ok'));
  }

  // Deshabilitar todos los botones de esta pregunta
  opts.querySelectorAll('button').forEach(b => { b.style.pointerEvents = 'none'; });

  // Comprobar si se han respondido todas las preguntas
  const quiz  = opts.closest('.mini-quiz');
  const total = quiz.querySelectorAll('.quiz-opts').length;
  const done  = quiz.querySelectorAll('.quiz-opts[data-answered]').length;

  if (done === total) {
    const ok = quiz.querySelectorAll('.quiz-opts[data-answered] .q-ok').length;
    const sc = quiz.querySelector('.quiz-score');
    if (ok === total) {
      sc.textContent = '🏆 ¡Perfecto! ' + ok + '/' + total + ' — ¡Eres un campeón/a!';
    } else if (ok >= Math.ceil(total / 2)) {
      sc.textContent = '⭐ ' + ok + '/' + total + ' — ¡Muy bien, sigue así!';
    } else {
      sc.textContent = '📚 ' + ok + '/' + total + ' — Repasa el tema y vuelve a intentarlo.';
    }
    sc.style.display = 'block';
  }
}

/* ============================================================
   SISTEMA DE BLOQUEO POR CÓDIGO
   ► Para cambiar los códigos, edita el objeto SDA_CODES
   ============================================================ */

const SDA_CODES = {
  2: 'DECIMALES',
  3: 'DINERO',
  4: 'FRACCIONES',
  5: 'MEDIDAS',
  6: 'TIEMPO',
  7: 'ESTADISTICA',
  8: 'GEOMETRIA'
};

/**
 * Comprueba si la SDA está bloqueada y muestra el overlay si es necesario.
 * @param {number} sdaNum — número de la SDA (2-8)
 */
function initLock(sdaNum) {
  if (localStorage.getItem('jmt_sda' + sdaNum) === '1') return; // ya desbloqueada
  const overlay = document.getElementById('lock-overlay');
  overlay.classList.add('active');
  setTimeout(function() {
    const inp = document.getElementById('lock-input');
    if (inp) inp.focus();
  }, 100);
}

/**
 * Valida el código introducido y desbloquea la SDA si es correcto.
 * @param {number} sdaNum — número de la SDA (2-8)
 */
function tryUnlock(sdaNum) {
  const inp = document.getElementById('lock-input');
  const val = inp.value.trim().toUpperCase();
  if (val === SDA_CODES[sdaNum]) {
    localStorage.setItem('jmt_sda' + sdaNum, '1');
    document.getElementById('lock-overlay').classList.remove('active');
    document.getElementById('lock-error').style.display = 'none';
    inp.value = '';
  } else {
    const err = document.getElementById('lock-error');
    err.style.display = 'block';
    inp.value = '';
    inp.focus();
    // Pequeña animación de shake
    inp.style.borderColor = '#e88f8f';
    setTimeout(function() { inp.style.borderColor = ''; }, 800);
  }
}
