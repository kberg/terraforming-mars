export const GAME_MODULES = [
  'base',
  'corpera',
  'promo',
  'venus',
  'colonies',
  'prelude',
  'prelude2',
  'turmoil',
  'community',
  'ares',
  'moon',
  'pathfinders',
  'ceo',
  'underworld',
] as const;
export type GameModule = typeof GAME_MODULES[number];

export const EXPANSION_NAMES: Record<GameModule, string> = {
  'base': 'Base',
  'corpera': 'Corporate Era',
  'prelude': 'Prelude',
  'prelude2': 'Prelude 2',
  'venus': 'Venus Next',
  'colonies': 'Colonies',
  'turmoil': 'Turmoil',
  'promo': 'Promos',
  'ares': 'Ares',
  'community': 'Community',
  'moon': 'The Moon',
  'pathfinders': 'Pathfinders',
  'ceo': 'CEOs',
  'underworld': 'Underworld',
} as const;
