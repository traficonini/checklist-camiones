// Service worker mínimo: guarda la pantalla para que abra rápido.
// Los datos siempre van a la red (nunca se cachean las respuestas de Apps Script).
const CACHE = 'checklist-camiones-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './logo-header.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Lo que viene de Apps Script o es POST: directo a la red
  if (e.request.method !== 'GET' || url.hostname.endsWith('script.google.com') || url.hostname.endsWith('googleusercontent.com')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
