
const CACHE = 'mp-cache-v1';
const FILES = ['/', '/index.html', '/style.css', '/js/main.js', '/js/player.js','/js/enemy.js','/js/ui.js','/js/sound.js'];
self.addEventListener('install', evt=>{
  evt.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('fetch', evt=>{
  evt.respondWith(caches.match(evt.request).then(r=> r || fetch(evt.request)));
});
