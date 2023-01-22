import type { WebSocket } from 'ws';
import { message } from '../utils/paintConsole.js';
import { parseCommand } from '../utils/parseCommand.js';
import type { ParsedCommand } from '../types.js';

class WsController {
  constructor(private ws: WebSocket) {}

  start() {
    this.ws.on('message', (data) => {
      const receivedMessage = data.toString();
      console.log('Received command: ', message(receivedMessage));

      const command = parseCommand(receivedMessage);
      this.handleCommands(command);
    });
  }

  private handleCommands(command: ParsedCommand) {
    switch (command.action) {
      case 'mouse_up':
        this.mouseUp(command.param1!);
        break;
      case 'mouse_down':
        this.mouseDown(command.param1!);
        break;
      case 'mouse_left':
        this.mouseLeft(command.param1!);
        break;
      case 'mouse_right':
        this.mouseRight(command.param1!);
        break;
      case 'mouse_position':
        this.getPosition();
        break;
      case 'draw_circle':
        this.drawCircle(command.param1!);
        break;
      case 'draw_rectangle':
        this.drawRect(command.param1!, command.param2!);
        break;
      case 'draw_square':
        this.drawSquare(command.param1!);
        break;
      case 'prnt_scrn':
        this.getPrntScrn();
        break;
    }
  }

  mouseUp(yOffset: number) {
    console.log(yOffset);
  }

  mouseDown(yOffset: number) {
    console.log(yOffset);
  }

  mouseLeft(xOffset: number) {
    console.log(xOffset);
  }

  mouseRight(xOffset: number) {
    console.log(xOffset);
  }

  getPosition() {
    console.log('it work');
  }

  drawCircle(radius: number) {
    console.log(radius);
  }

  drawRect(width: number, height: number) {
    console.log(width, height);
  }

  drawSquare(width: number) {
    console.log(width);
  }

  getPrntScrn() {
    console.log('it work');
  }
}

export default WsController;
