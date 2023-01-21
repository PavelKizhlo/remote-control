import { WebSocketServer } from 'ws';
import { info, message } from '../utils/paintConsole.js';

const WS_PORT = 8080;
const WS_HOST = 'localhost';

const wss = new WebSocketServer({ host: WS_HOST, port: WS_PORT });

wss.on('connection', (ws) => {
  console.log(info(`Start WebSocket server on the ws://${WS_HOST}:${WS_PORT}`));

  ws.on('message', (data) => {
    console.log('Client: ', message(data.toString()));
  });
});
