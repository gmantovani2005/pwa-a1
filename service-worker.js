let cacheName = 'notes-son.v1.0.0';
let filesToCache = [
    './',
    'index.html',
    'css/colors.css',
    'css/style.css',
    'js/array.observe.polyfill.js',
    'js/object.observe.polyfill.js',
    'js/script.js'
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installer');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching App Shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('active', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promisse.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache');
                    return caches.delete(key);
                }
            }));
        })
    )
});

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});