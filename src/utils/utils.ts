export const playerColorClass = (color: string, type: 'shadow' | 'bg' | 'bg_transparent'): string => {
  const prefix = {
    shadow: 'player_shadow_color_',
    bg_transparent: 'player_translucent_bg_color_',
    bg: 'player_bg_color_',
  }[type];

  return `${prefix}${color}`;
};

export const range = (n: number): Array<number> => Array.from(Array(n).keys());
export const generateClassString = (classes: Array<string>): string => classes.join(' ').trimStart();

export function deArray<T>(input: T | Array<T>): T | undefined {
  if (!Array.isArray(input)) {
    return input;
  }
  if (input.length > 0) {
    return input[0];
  }
  return undefined;
}

/**
 * Returns a new array consisting of elements only in both a and b.
 *
 * This preserves the order of the first array.
 *
 * @param {ReadonlyArray<T>} a: the first array
 * @param {ReadonlyArray<T>} b: the second array
 * @return {Array<T>} the intersection of both arrays
 */
export function intersection<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): Array<T> {
  return a.filter((e) => b.includes(e));
}
