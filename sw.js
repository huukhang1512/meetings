[{"revision":"9a0092e118cc28f0d146162396ff8db2","url":"asset-manifest.json"},{"revision":"a456ef20cf6dc1ce2a4d36f66b7a7b1f","url":"index.html"},{"revision":"a72372c6e18b8f2f3c32b584a3f3ccb4","url":"logo1.png"},{"revision":"18a259fd6e1fd9e045556e6cab0fa995","url":"manifest.json"},{"revision":"a0e402657814542335318f0db1fd9cc9","url":"offline.html"},{"revision":"2f67f15517d87319cd891d9e074022a8","url":"precache-manifest.2f67f15517d87319cd891d9e074022a8.js"},{"revision":"975e0fc23327fe900c4b662636521921","url":"service-worker.js"},{"revision":"1b5c2c5bf0571ab2ebc16576531f28b5","url":"static/css/main.4c7fb606.chunk.css"},{"revision":"4a69630ef82d81bb6bac4683642f48fc","url":"static/js/2.2effd39c.chunk.js"},{"revision":"7e9eec9bc94ab7699e5fb61b6e0d336e","url":"static/js/main.acd7f95c.chunk.js"},{"revision":"3d5fd567814738a8e30e261db8bd3653","url":"static/js/runtime~main.fd2e02fa.js"},{"revision":"8266e13caeba9541e567d8955cbc3561","url":"workbox-dfa170d2.js"}]
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