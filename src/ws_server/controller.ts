import type { WebSocket } from 'ws';
import { message, warning } from '../utils/paintConsole.js';
import { parseCommand } from '../utils/parseCommand.js';
import { ClientCommands, ParsedCommand } from '../types.js';
import { Button, mouse } from '@nut-tree/nut-js';
import { calcRectPoints } from '../utils/calcRectPoints.js';
import { isOutside } from '../utils/checkPointPos.js';

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
      case ClientCommands.Down:
      case ClientCommands.Left:
      case ClientCommands.Right:
        try {
          await this.mouseMove();
        } catch (err) {
          console.log(warning((<Error>err).message));
        }
        break;
      case ClientCommands.Position:
        await this.getPosition();
        break;
      case ClientCommands.Circle:
        await this.drawCircle();
        break;
      case ClientCommands.Rect:
      case ClientCommands.Square:
        try {
          await this.drawRect();
        } catch (err) {
          console.log(warning((<Error>err).message));
        }
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

    if (await isOutside(newPosition)) {
      throw new Error('Cannot move cursor out of the screen');
    }

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
    const width = this.command.param1!;
    const height = this.command.param2 ?? this.command.param1!;
    const points = await calcRectPoints(width, height);

    for (let i = 0; i < 4; i++) {
      await mouse.pressButton(Button.LEFT);
      await mouse.move([points[i]!, points[i === 3 ? 0 : i + 1]!]);
      await mouse.releaseButton(Button.LEFT);
    }
  }

  private async getPrntScrn() {
    console.log('it work');
  }
}

export default WsController;
