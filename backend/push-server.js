'use strict'
const webpush = require('web-push');
const publicVapidKey = 'BIBjuG2quJFRKYgdOKaFLB_ZjjuAc6T8gPq7rgdTFa0sGQ5opyeqboPklw6y8V-RzAV8RZGE0A1ZcfIEJ9h3GfM';
const privateVapidKey = 'rbU8wAzg3tEg9h-qqto_TxSYLXNU33ggI9UjVFDAqsE';

// Replace with your email
webpush.setVapidDetails('mailto:huukhang1512@gmail.com', publicVapidKey, privateVapidKey);

module.exports.subscribe = async (event, context, callback) => {

  const subscription = JSON.parse(event.body);  
  const testPayload = JSON.stringify({ title: 'test' });

  webpush.sendNotification(subscription, testPayload).catch(error => {
    console.error(error.stack);
  });

  callback(null, {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Success!'
    })
  });
}

module.exports.pushToWeb = async (event, context, callback) => {
  console.log(event)
  let fails = [];
  const message = event.message;  
  let subscriptions = JSON.parse(event.subscriptions);  
  if( !Array.isArray(subscriptions)){
    subscriptions = [subscriptions]
  }

  console.log(event.subscriptions, subscriptions)

  const payload = JSON.stringify({ message: message });
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload)
      .catch(error => {
        fails.push(sub);
        console.error(error.stack);
      });
  });

  callback(null, {
    statusCode: 201,
    body: JSON.stringify({
      fails : fails
    })
  });
}