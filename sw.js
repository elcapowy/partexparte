/* PARTE X PARTE — Service Worker
   Estrategia: stale-while-revalidate para archivos propios (rápido + se actualiza
   en segundo plano), cache-first para CDNs y fuentes. Permite uso offline en la calle. */
const VERSION = 'pxp-v3';
const CORE = 'pxp-core-' + VERSION;
const RUNTIME = 'pxp-runtime-' + VERSION;

// Shell mínimo para que la app abra sin conexión luego de instalada.
const CORE_ASSETS = [
  './partexparte.html',
  'styles.css',
  'image-slot.js',
  'ac-images.js',
  'catalogo.js',
  'tweaks-panel.jsx',
  'data.jsx',
  'icons.jsx',
  'ui.jsx',
  'diagrama.jsx',
  'kits.jsx',
  'ai-diagnostico.jsx',
  'sections.jsx',
  'app.jsx',
  'manifest.webmanifest',
  'assets/app-icon-192.png',
  'assets/app-icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CORE).then((c) => c.addAll(CORE_ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .catch(() => {}) // si algún asset falla, no bloquear la instalación
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CORE && k !== RUNTIME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!/^https?:$/.test(url.protocol)) return;

  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // network-first: siempre trae la versión más nueva; cae a caché sólo sin conexión.
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req))
    );
  } else {
    // CDNs / fuentes: cache-first
    e.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => cached)
      )
    );
  }
});
