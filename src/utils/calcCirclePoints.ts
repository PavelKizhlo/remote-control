import { Point } from '@nut-tree/nut-js';
import { mouse } from '@nut-tree/nut-js';
import { isOutside } from './checkPointPos.js';

export async function calcCirclePoints(radius: number): Promise<Point[]> {
  const start = await mouse.getPosition();
  const center = new Point(start.x, start.y + radius);

  const points: Point[] = [];

  for (let i = 0; i < 36; i++) {
    const x = Math.cos((2 * Math.PI * (i - 9)) / 36) * radius + center.x;
    const y = Math.sin((2 * Math.PI * (i - 9)) / 36) * radius + center.y;
    points.push(new Point(x, y));
  }
  const extremeRight = new Point(center.x + radius, center.y);
  const extremeBottom = new Point(center.x, center.y + radius);
  const extremeLeft = new Point(center.x - radius, center.y);

  const pointCheck = await Promise.all(
    [start, extremeRight, extremeBottom, extremeLeft].map((point) => isOutside(point)),
  );

  pointCheck.forEach((isOutside) => {
    if (isOutside) {
      throw new Error('Cannot draw a figure outside the screen');
    }
  });

  return points;
}
