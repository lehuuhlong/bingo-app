import io from 'socket.io-client';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const socket = io(serverUrl, {
  transports: ['websocket'],
});

export default socket;
