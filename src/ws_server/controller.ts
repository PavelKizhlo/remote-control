import type { Duplex } from 'stream';
import Jimp from 'jimp';
import { message, warning } from '../utils/paintConsole.js';
import { parseCommand } from '../utils/parseCommand.js';
import { ClientCommands, ParsedCommand } from '../types.js';
import { Button, mouse, Point, Region, screen } from '@nut-tree/nut-js';
import { calcRectPoints } from '../utils/calcRectPoints.js';
import { isOutside } from '../utils/checkPointPos.js';
import { calcCirclePoints } from '../utils/calcCirclePoints.js';

class WsController {
  declare command: ParsedCommand;

  constructor(private duplex: Duplex) {}

  start() {
    this.duplex.on('data', async (data) => {
      console.log('Received command: ', message(data));

      this.command = parseCommand(data);
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
        try {
          await this.drawCircle();
        } catch (err) {
          console.log(warning((<Error>err).message));
        }
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
        try {
          await this.getPrntScrn();
        } catch (err) {
          console.log(warning((<Error>err).message));
        }
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

    this.duplex.write(`mouse_position ${position.x},${position.y}`, 'utf8');
    console.log('Result: ', message(`current position: ${JSON.stringify(position)}`));
  }

  private async drawCircle() {
    const radius = this.command.param1!;
    const points = await calcCirclePoints(radius);

    for (let i = 0; i < 36; i++) {
      await mouse.pressButton(Button.LEFT);
      await mouse.move([points[i]!, points[i === 35 ? 0 : i + 1]!]);
      await mouse.releaseButton(Button.LEFT);
    }
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
    const position = await mouse.getPosition();
    const outsideScreen =
      (await isOutside(new Point(position.x + 200, position.y))) ||
      (await isOutside(new Point(position.x, position.y + 200)));

    if (outsideScreen) {
      throw new Error('Cannot do screenshot, frame outside the screen');
    }

    const frame = new Region(position.x, position.y, 200, 200);
    const bgrImage = await screen.grabRegion(frame);
    const rgbImage = await bgrImage.toRGB();

    const jimp = new Jimp(rgbImage);
    const base64str = await jimp.getBase64Async(Jimp.MIME_PNG);
    const base64 = base64str.replace('data:image/png;base64,', '');
    this.duplex.write(`prnt_scrn ${base64}`, 'base64');
  }
}

export default WsController;
