import {CardName} from '../CardName';
import {ASIMOV_AWARD_BONUS} from '../constants';
import {Player} from '../Player';

export interface IAward {
    name: string;
    description: string;
    getScore: (player: Player) => number;
}

export function getAdditionalScore(player: Player): number {
  let score = 0;
  if (player.cardIsInEffect(CardName.ASIMOV)) score += ASIMOV_AWARD_BONUS;
  return score;
}
