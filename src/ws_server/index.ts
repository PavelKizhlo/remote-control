import { WebSocketServer } from 'ws';
import { info } from '../utils/paintConsole.js';
import WsController from './controller.js';

const WS_PORT = 8080;
const WS_HOST = 'localhost';

const wss = new WebSocketServer({ host: WS_HOST, port: WS_PORT });

wss.on('connection', (ws) => {
  console.log(info(`Start WebSocket server on the ws://${WS_HOST}:${WS_PORT}`));

  const controller = new WsController(ws);
  controller.start();
});

process.on('SIGINT', () => {
  wss.close();
});
