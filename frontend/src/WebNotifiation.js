import axios from 'axios';
import { BACKEND_API_URL } from './config';
// Hard-coded, replace with your public key
const publicVapidKey = 'BIBjuG2quJFRKYgdOKaFLB_ZjjuAc6T8gPq7rgdTFa0sGQ5opyeqboPklw6y8V-RzAV8RZGE0A1ZcfIEJ9h3GfM';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function subscribeToRoom(roomid) {
  if ('serviceWorker' in navigator){
    return navigator.serviceWorker.getRegistration("/")
    .then(registration => {
      console.log('Registering push');
      return registration.pushManager.subscribe({
          userVisibleOnly: true, 
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
      
    }).then(subscription => {
      console.log('Registered push', subscription);
      return axios(`${BACKEND_API_URL}/subscribeToPush`, {
        method: 'POST',
        data: {
          roomid : roomid,
          subscription : JSON.stringify(subscription)
        },
        headers: {
          'content-type': 'application/json'
        }
      });  
    });
  }
}
