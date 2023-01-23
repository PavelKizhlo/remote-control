import { Point, screen } from '@nut-tree/nut-js';

export async function isOutside(point: Point) {
  const screenWidth = await screen.width();
  const screenHeight = await screen.height();

  return point.x >= screenWidth || point.y >= screenHeight || point.x <= 0 || point.y <= 0;
}
