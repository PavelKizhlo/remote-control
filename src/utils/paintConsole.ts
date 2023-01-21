export const info = (str: string) => {
  return `\x1b[34m${str}\x1b[0m`;
};

export const message = (str: string) => {
  return `\x1b[35m${str}\x1b[0m`;
};
