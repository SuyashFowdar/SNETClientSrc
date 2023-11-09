/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.\n' +
                'For more details, visit https://goo.gl/AFskqB'
            )
            // self.addEventListener('activate', event => {
            //     event.waitUntil(self.clients.claim());
            // });
            console.log('self', self);

            self.addEventListener('fetch', event => {
                const request = event.request;
                const url = new URL(request.url);
                if (url.origin === location.origin) {
                    event.respondWith(cacheFirst(request));
                } else {
                    event.respondWith(networkFirst(request));
                }
            });

            async function cacheFirst(request) {
                const cachedResponse = await caches.match(request);
                return cachedResponse || fetch(request);
            }

            async function networkFirst(request) {
                const dynamicCache = await caches.open('news-dynamic');
                try {
                    const networkResponse = await fetch(request);
                    dynamicCache.put(request, networkResponse.clone());
                    return networkResponse;
                } catch (err) {
                    const cachedResponse = await dynamicCache.match(request);
                    return cachedResponse || await caches.match('./fallback.json');
                }
            }
        },
        cached() {
            console.log('Content has been cached for offline use.')
        },
        updated() {
            console.log('New content is available; please refresh.')
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.')
        },
        error(error) {
            console.error('Error during service worker registration:', error)
        }
    })
}
// else {
//     register(`./service-worker.js`, {
//         ready() {
//             console.log('ready');
//         }
//     })
// }