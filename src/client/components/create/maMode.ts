import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';

/** How the game's milestones and awards are chosen, as offered on the create game form. */
export type MAMode = 'board' | 'random' | 'manual';

export const MA_MODES: ReadonlyArray<MAMode> = ['board', 'random', 'manual'];

/** The text shown for each mode. */
export const MA_MODE_LABELS: Record<MAMode, string> = {
  'board': 'Board',
  'random': 'Random',
  'manual': 'Manual',
};

/**
 * Where random milestones and awards are drawn from.
 *
 * 'official' is the official modular set (the modularMA option). 'maps' is this site's own selection, drawn from the
 * milestones and awards on the official boards, and 'maps+fan' adds the fan boards (the includeFanMA option).
 */
export type MASource = 'official' | 'maps' | 'maps+fan';

export const MA_SOURCES: ReadonlyArray<MASource> = ['official', 'maps', 'maps+fan'];

/** The text shown for each source. */
export const MA_SOURCE_LABELS: Record<MASource, string> = {
  'official': 'Official',
  'maps': 'Maps',
  'maps+fan': 'Maps + Fan maps',
};

/** The synergy choices offered by the random mode. */
export const MA_SYNERGIES = [RandomMAOptionType.LIMITED, RandomMAOptionType.UNLIMITED] as const;

/** The mode that matches this randomMA option. */
export function maMode(randomMA: RandomMAOptionType): MAMode {
  switch (randomMA) {
  case RandomMAOptionType.NONE:
    return 'board';
  case RandomMAOptionType.MANUAL:
    return 'manual';
  case RandomMAOptionType.LIMITED:
  case RandomMAOptionType.UNLIMITED:
    return 'random';
  }
}

/** The source that matches the modularMA option. */
export function maSource(modularMA: boolean, includeFanMA: boolean): MASource {
  if (modularMA) {
    return 'official';
  }
  return includeFanMA ? 'maps+fan' : 'maps';
}

/** The game options for a source. The official set has no fan milestones and awards. */
export function maSourceOptions(source: MASource): {modularMA: boolean, includeFanMA: boolean} {
  return {modularMA: source === 'official', includeFanMA: source === 'maps+fan'};
}

/**
 * The game options for a mode.
 *
 * The random mode keeps `randomMA`'s synergy and `modularMA` when it's already random, and otherwise uses limited synergy
 * from the maps, which was the form's earlier default.
 */
export function maModeOptions(mode: MAMode, randomMA: RandomMAOptionType, modularMA: boolean): {randomMA: RandomMAOptionType, modularMA: boolean} {
  switch (mode) {
  case 'board':
    return {randomMA: RandomMAOptionType.NONE, modularMA: false};
  case 'random':
    if (maMode(randomMA) === 'random') {
      return {randomMA, modularMA};
    }
    return {randomMA: RandomMAOptionType.LIMITED, modularMA: false};
  case 'manual':
    return {randomMA: RandomMAOptionType.MANUAL, modularMA: false};
  }
}
