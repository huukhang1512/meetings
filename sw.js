[{"revision":"c92eaf042be52a7183290fa984bd91c4","url":"asset-manifest.json"},{"revision":"edba0502f14bf6716ec2f6750363a955","url":"index.html"},{"revision":"80eef162b4ef78a2a64c005c251d7076","url":"logo1.png"},{"revision":"1ed80a2dda9350a3b5f4a868b670ef6b","url":"logo2.png"},{"revision":"323821ba21945fe84e343ac4b826bd75","url":"logo3.png"},{"revision":"aa7ac9abb997fb22d065135e6c7e2ada","url":"manifest.json"},{"revision":"a0e402657814542335318f0db1fd9cc9","url":"offline.html"},{"revision":"87f343e8093ec4ad95ce4b50d679cfa1","url":"precache-manifest.87f343e8093ec4ad95ce4b50d679cfa1.js"},{"revision":"c9b56ebcacefe1695a6ce3e6d8aee735","url":"service-worker.js"},{"revision":"1b5c2c5bf0571ab2ebc16576531f28b5","url":"static/css/main.4c7fb606.chunk.css"},{"revision":"fcadaac38cd002f9b36bdc84536b647c","url":"static/js/2.cff80531.chunk.js"},{"revision":"cf158af8630b79571c73fcb5ec71d9b4","url":"static/js/main.12825ecf.chunk.js"},{"revision":"238c9148d722c1b6291779bd879837a1","url":"static/js/runtime~main.a8a9905a.js"},{"revision":"8266e13caeba9541e567d8955cbc3561","url":"workbox-dfa170d2.js"}]
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