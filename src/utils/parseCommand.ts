import type { ParsedCommand } from '../types.js';

export function parseCommand(command: string): ParsedCommand {
  return Object.fromEntries(
    command
      .split(' ')
      .map((value, index): (string | number)[] => [
        <string>['action', 'param1', 'param2'][index],
        isNaN(+value) ? value : +value,
      ]),
  );
}
