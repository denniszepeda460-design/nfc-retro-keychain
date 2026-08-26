const CACHE_NAME = 'nfc-retro-cache-v1';

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Estrategia: si ya está en caché, sírvelo al instante.
// Si no, pídelo a la red y guárdalo en caché para la próxima vez.
// Esto aplica tanto a tus archivos (html/css/rom) como a los del
// CDN de EmulatorJS (los núcleos wasm), así que después de la primera
// carga todo abre casi instantáneo, incluso sin buena señal.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(event.request);
            if (cached) return cached;
            try {
                const response = await fetch(event.request);
                cache.put(event.request, response.clone());
                return response;
            } catch (err) {
                return cached;
            }
        })
    );
});
