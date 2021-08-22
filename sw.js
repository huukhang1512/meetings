[{"revision":"b8ba70df0c2cabb5b5200d112bfd81cc","url":"asset-manifest.json"},{"revision":"4690e7b2d37322a0846cb79e32335b78","url":"index.html"},{"revision":"a72372c6e18b8f2f3c32b584a3f3ccb4","url":"logo1.png"},{"revision":"18a259fd6e1fd9e045556e6cab0fa995","url":"manifest.json"},{"revision":"a0e402657814542335318f0db1fd9cc9","url":"offline.html"},{"revision":"0127688e7ab8c10cd7f22485dd61a676","url":"precache-manifest.0127688e7ab8c10cd7f22485dd61a676.js"},{"revision":"00e370e7cb789b1ea6fb8222768512a5","url":"service-worker.js"},{"revision":"1b5c2c5bf0571ab2ebc16576531f28b5","url":"static/css/main.4c7fb606.chunk.css"},{"revision":"d30574f8ba38c8ec5e021e2e6ba47a18","url":"static/js/2.ccf397ac.chunk.js"},{"revision":"a0325336e79296debfa61660319a69d5","url":"static/js/main.c0d92b74.chunk.js"},{"revision":"3d5fd567814738a8e30e261db8bd3653","url":"static/js/runtime~main.fd2e02fa.js"},{"revision":"8266e13caeba9541e567d8955cbc3561","url":"workbox-dfa170d2.js"}]
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