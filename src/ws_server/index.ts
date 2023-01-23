import { createWebSocketStream, WebSocketServer } from 'ws';
import { info } from '../utils/paintConsole.js';
import WsController from './controller.js';

const WS_PORT = 8080;
const WS_HOST = 'localhost';

const wss = new WebSocketServer({ host: WS_HOST, port: WS_PORT });

wss.on('connection', (ws) => {
  console.log(info(`Start WebSocket server on the ws://${WS_HOST}:${WS_PORT}`));

  const duplex = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false });

  const controller = new WsController(duplex);
  controller.start();
});

process.on('SIGINT', () => {
  wss.close();
});
