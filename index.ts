import './src/ws_server/index.js';
import { httpServer } from './src/http_server/index.js';
import { info } from './src/utils/paintConsole.js';
// import { mouse } from '@nut-tree/nut-js';

const HTTP_PORT = 8181;

console.log(info(`Start static http server on the ${HTTP_PORT} port!`));
httpServer.listen(HTTP_PORT);
