import type { WebSocket } from 'ws';
import { message } from '../utils/paintConsole.js';
import { parseCommand } from '../utils/parseCommand.js';
import { ParsedCommand, ClientCommands } from '../types.js';
import { mouse } from '@nut-tree/nut-js';

class WsController {
  declare command: ParsedCommand;

  constructor(private ws: WebSocket) {}

  start() {
    this.ws.on('message', async (data) => {
      const receivedMessage = data.toString();
      console.log('Received command: ', message(receivedMessage));

      this.command = parseCommand(receivedMessage);
      await this.handleCommands();
    });
  }

  private async handleCommands() {
    switch (this.command.action) {
      case ClientCommands.Up:
        await this.mouseMove();
        break;
      case ClientCommands.Down:
        await this.mouseMove();
        break;
      case ClientCommands.Left:
        await this.mouseMove();
        break;
      case ClientCommands.Right:
        await this.mouseMove();
        break;
      case ClientCommands.Position:
        await this.getPosition();
        break;
      case ClientCommands.Circle:
        await this.drawCircle();
        break;
      case ClientCommands.Rect:
        await this.drawRect();
        break;
      case ClientCommands.Square:
        await this.drawSquare();
        break;
      case ClientCommands.PrintScreen:
        await this.getPrntScrn();
        break;
    }
  }

  private async mouseMove() {
    const position = await mouse.getPosition();
    const offset = this.command.param1!;
    const increase =
      this.command.action === ClientCommands.Down || this.command.action === ClientCommands.Right;
    const axis =
      this.command.action === ClientCommands.Up || this.command.action === ClientCommands.Down
        ? 'y'
        : 'x';

    const newPosition = increase
      ? { ...position, [axis]: position[axis] + offset }
      : { ...position, [axis]: position[axis] - offset };

    console.log('Result: ', message(`new position: ${JSON.stringify(newPosition)}`));
    await mouse.setPosition(newPosition);
  }

  private async getPosition() {
    const position = await mouse.getPosition();

    this.ws.send(`mouse_position ${position.x},${position.y}`);
    console.log('Result: ', message(`current position: ${JSON.stringify(position)}`));
  }

  private async drawCircle() {
    console.log(this.command.param1);
  }

  private async drawRect() {
    console.log(this.command.param1, this.command.param2);
  }

  private async drawSquare() {
    console.log(this.command.param1);
  }

  private async getPrntScrn() {
    console.log('it work');
  }
}

export default WsController;
