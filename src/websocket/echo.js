import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '24ekzaokxyrtfmkqfbqz',
    wsHost: window.location.hostname,
    wsPort: 8080,
    forceTLS: false,
    cluster: 'mt1',
    disableStats: true,
    enabledTransports: ['ws'],
});
