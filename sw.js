[{"revision":"43f8ff3b10e095696bc899ae5aca2aba","url":"asset-manifest.json"},{"revision":"7dd7374e729e96ee2a634f12ffcbf3aa","url":"index.html"},{"revision":"80eef162b4ef78a2a64c005c251d7076","url":"logo1.png"},{"revision":"1ed80a2dda9350a3b5f4a868b670ef6b","url":"logo2.png"},{"revision":"323821ba21945fe84e343ac4b826bd75","url":"logo3.png"},{"revision":"aa7ac9abb997fb22d065135e6c7e2ada","url":"manifest.json"},{"revision":"a0e402657814542335318f0db1fd9cc9","url":"offline.html"},{"revision":"1d45b389fb00fe2fc0f8c17f2f6360bf","url":"precache-manifest.1d45b389fb00fe2fc0f8c17f2f6360bf.js"},{"revision":"8fde3c1fb2f2f609bb1c1e3955e0bb64","url":"service-worker.js"},{"revision":"1b5c2c5bf0571ab2ebc16576531f28b5","url":"static/css/main.4c7fb606.chunk.css"},{"revision":"fcadaac38cd002f9b36bdc84536b647c","url":"static/js/2.cff80531.chunk.js"},{"revision":"a52afe52849c6e2a4694f6fcc5bce0c9","url":"static/js/main.7fe75ea2.chunk.js"},{"revision":"3d5fd567814738a8e30e261db8bd3653","url":"static/js/runtime~main.fd2e02fa.js"},{"revision":"8266e13caeba9541e567d8955cbc3561","url":"workbox-dfa170d2.js"}]
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