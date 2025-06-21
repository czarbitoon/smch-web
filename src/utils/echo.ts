import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// @ts-ignore
window.Pusher = Pusher;

export function createEcho(token: string) {
  return new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_PUSHER_APP_KEY,
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    wsHost: process.env.REACT_APP_PUSHER_HOST || `ws-${process.env.REACT_APP_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: process.env.REACT_APP_PUSHER_PORT ? Number(process.env.REACT_APP_PUSHER_PORT) : 80,
    wssPort: process.env.REACT_APP_PUSHER_PORT ? Number(process.env.REACT_APP_PUSHER_PORT) : 443,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/api/broadcasting/auth',
    auth: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
}
