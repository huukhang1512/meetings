[{"revision":"1c8f7a75d2277b74e0ac4378fe95dcb6","url":"index.html"},{"revision":"3a5476a5c0d768af04399c0fe6b445c8","url":"logo1.png"},{"revision":"345b26a1ee37714ccc8fe42af81aadac","url":"logo2.png"},{"revision":"f8a86e5ccbc571a37127bfbc99908915","url":"manifest.json"},{"revision":"5af9327b7f10c80fded1a7847b5f7ea7","url":"offline.html"},{"revision":"8266e13caeba9541e567d8955cbc3561","url":"workbox-dfa170d2.js"}]
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.loadModule('workbox-strategies');
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
const FALLBACK_HTML_URL = ['/offline.html','/logo1.png']
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