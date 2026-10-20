// JaqueMáTICas · service worker offline (generado) v202610202209
const CACHE = 'jaquematicas-v202610202209';
const ASSETS = ["/","/ajedrez/ajedrez.css","/ajedrez/ajedrez.js","/ajedrez/index.html","/ajedrez/Juego_Completo.html","/ajedrez/Nivel_1_Operaciones.html","/ajedrez/Nivel_2_Decimales.html","/ajedrez/Nivel_3_Dinero.html","/ajedrez/Nivel_4_Fracciones.html","/ajedrez/Nivel_5_Medidas.html","/ajedrez/Nivel_6_El_tiempo.html","/ajedrez/Nivel_7_Estadistica.html","/ajedrez/Nivel_8_Geometria.html","/Alcudia%20guay%20brazo%20abajo.png","/ALFIN%20guay.png","/apps/caja-fuerte-vinalopo.html","/apps/reloj-del-abuelo.html","/apps/viaje-navidad/index.html","/glorieta%20guay.png","/imagenes/cap1_vinalopop.png","/imagenes/cap2_alcudia.png","/imagenes/cap3_mercado.jpeg","/imagenes/cap4_glorieta.png","/imagenes/cap5_raval.png","/imagenes/cap6_reloj.png","/imagenes/cap7_alfin.png","/imagenes/cap8_pi.png","/imagenes/contraportada.png","/imagenes/epilogo.png","/imagenes/portada.png","/imagenes/web_cap1_vinalopop.jpg","/imagenes/web_cap2_alcudia.jpg","/imagenes/web_cap3_mercado.jpg","/imagenes/web_cap4_glorieta.jpg","/imagenes/web_cap5_raval.jpg","/imagenes/web_cap6_reloj.jpg","/imagenes/web_cap7_alfin.jpg","/imagenes/web_cap8_pi.jpg","/imagenes/web_contraportada.jpg","/imagenes/web_epilogo.jpg","/imagenes/web_portada.jpg","/index.html","/jm-icon-512.png","/juego/Capitulo_1_Multiplicacion_y_division.html","/juego/Capitulo_2_Decimales.html","/juego/Capitulo_3_Dinero.html","/juego/Capitulo_4_Fracciones.html","/juego/Capitulo_5_Unidades_de_medida.html","/juego/Capitulo_6_El_tiempo.html","/juego/Capitulo_7_Estadistica.html","/juego/Capitulo_8_Geometria.html","/juego/engine.js","/juego/index.html","/juego/Juego_Completo.html","/juego/PRUEBA_SALTO.html","/juego/vainilla.css","/MAPA%20REINO.png","/pi%20guay.png","/practica_ajedrez.html","/rabal%20guay.png","/Reina%20y%20rey%20en%20ajedrez%20medieval.png","/sda1.html","/sda2.html","/sda3.html","/sda4.html","/sda5.html","/sda6.html","/sda7.html","/sda8.html","/styles.css","/utils.js","/vinalopop%20guay%20final.png"];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // tolerante: si algún archivo falla, no aborta la instalación
    await Promise.allSettled(ASSETS.map(u => c.add(new Request(u, { cache: 'reload' }))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // deja pasar YouTube, etc.
  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const resp = await fetch(req);
      if (resp && resp.ok) {
        const c = await caches.open(CACHE);
        c.put(req, resp.clone());
      }
      return resp;
    } catch (err) {
      // sin red: para navegaciones devuelve la página cacheada o el índice
      if (req.mode === 'navigate') {
        return (await caches.match(req, { ignoreSearch: true })) ||
               (await caches.match('/index.html')) ||
               (await caches.match('/'));
      }
      throw err;
    }
  })());
});
