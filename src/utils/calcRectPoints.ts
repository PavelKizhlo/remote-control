import { Point } from '@nut-tree/nut-js';
import { mouse } from '@nut-tree/nut-js';
import { isOutside } from './checkPointPos.js';

export async function calcRectPoints(width: number, height: number): Promise<Point[]> {
  const point1 = await mouse.getPosition();
  const point2 = new Point(point1.x + width, point1.y);
  const point3 = new Point(point2.x, point2.y + height);
  const point4 = new Point(point3.x - width, point3.y);

  const points = [point1, point2, point3, point4];

  const pointCheck = await Promise.all(points.map((point) => isOutside(point)));

  pointCheck.forEach((isOutside) => {
    if (isOutside) {
      throw new Error('Cannot draw a figure outside the screen');
    }
  });

  return points;
}
