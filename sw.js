[{"revision":"e32848abae147a7d72899d26a7bdc3f8","url":"asset-manifest.json"},{"revision":"a0a64d2bfbfb5381b640b2065ad547b2","url":"index.html"},{"revision":"a72372c6e18b8f2f3c32b584a3f3ccb4","url":"logo1.png"},{"revision":"6ae1d8c720d6f9ef7636aea89029ed96","url":"manifest.json"},{"revision":"a0e402657814542335318f0db1fd9cc9","url":"offline.html"},{"revision":"ebb1bd5a707bc18e196963cf398b5101","url":"precache-manifest.ebb1bd5a707bc18e196963cf398b5101.js"},{"revision":"ea46a819dedf5b0033175838a93f6004","url":"service-worker.js"},{"revision":"1b5c2c5bf0571ab2ebc16576531f28b5","url":"static/css/main.4c7fb606.chunk.css"},{"revision":"4a69630ef82d81bb6bac4683642f48fc","url":"static/js/2.2effd39c.chunk.js"},{"revision":"3a439037d9b0662c3571693299968eb9","url":"static/js/main.9486f0ff.chunk.js"},{"revision":"3d5fd567814738a8e30e261db8bd3653","url":"static/js/runtime~main.fd2e02fa.js"},{"revision":"8266e13caeba9541e567d8955cbc3561","url":"workbox-dfa170d2.js"}]
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