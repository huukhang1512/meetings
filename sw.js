[{"revision":"ecba770f466a6b04e2a54b4103d4c69a","url":"asset-manifest.json"},{"revision":"cbb9bef15b5be9d6bb0885603c993478","url":"index.html"},{"revision":"80eef162b4ef78a2a64c005c251d7076","url":"logo1.png"},{"revision":"1ed80a2dda9350a3b5f4a868b670ef6b","url":"logo2.png"},{"revision":"323821ba21945fe84e343ac4b826bd75","url":"logo3.png"},{"revision":"aa7ac9abb997fb22d065135e6c7e2ada","url":"manifest.json"},{"revision":"a0e402657814542335318f0db1fd9cc9","url":"offline.html"},{"revision":"efd3b19742b31e4d2fafc25851560c44","url":"precache-manifest.efd3b19742b31e4d2fafc25851560c44.js"},{"revision":"44b09c0268dff620b0932fa6bfafa9b9","url":"service-worker.js"},{"revision":"1b5c2c5bf0571ab2ebc16576531f28b5","url":"static/css/main.4c7fb606.chunk.css"},{"revision":"317a491cfc9f6225c6d6fdc7009ae2d6","url":"static/js/2.8195234d.chunk.js"},{"revision":"2af6e320289608a655c8d84452dd3310","url":"static/js/main.cfa3ece6.chunk.js"},{"revision":"238c9148d722c1b6291779bd879837a1","url":"static/js/runtime~main.a8a9905a.js"},{"revision":"8266e13caeba9541e567d8955cbc3561","url":"workbox-dfa170d2.js"}]
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.loadModule('workbox-strategies');
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
const FALLBACK_HTML_URL = ['/offline.html','/logo1.png','/logo2.png']
const networkOnly = new workbox.strategies.NetworkOnly();
workbox.precaching.precacheAndRoute(FALLBACK_HTML_URL);

workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkOnly()
 );
 workbox.routing.setCatchHandler(({event}) => {
       switch (event.request.destination) {
         case 'document':
         return caches.match('/offline.html');
       break;
       default:
         return Response.error();
   }
 });