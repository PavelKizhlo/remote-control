export enum ClientCommands {
  Up = 'mouse_up',
  Down = 'mouse_down',
  Left = 'mouse_left',
  Right = 'mouse_right',
  Position = 'mouse_position',
  Circle = 'draw_circle',
  Rect = 'draw_rectangle',
  Square = 'draw_square',
  PrintScreen = 'prnt_scrn',
}

export interface ParsedCommand {
  action: string;
  param1?: number;
  param2?: number;
}
