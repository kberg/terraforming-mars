import {ICard} from './ICard';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {Units} from '../../common/Units';
import {CardType} from '../../common/cards/CardType';
import {YesAnd} from './requirements/CardRequirement';

export type CanPlayResponse = boolean | YesAnd;

export type PlayableCard = {
  card: IProjectCard,
  details?: CanPlayResponse,
};

export interface IProjectCard extends ICard {
  canPlay(player: IPlayer, canAffordOptions?: CanAffordOptions): CanPlayResponse;
  cost: number;

  /**
   * Represents the bonus resource granted by this card, but only under limited circimstances.
   *
   * This attribute applies to cards where the player chooses a resource which needs to
   * be recalled later (at this point only for Robotic Workforce) as it applies to Mining Rights,
   * Mining Area, and Pathfinders' Specialized Settlement, for instance.
   *
   * It also provides a visual cue to indicate which production bonus the player might have have,
   * for the person playing Robotic Workforce.
   */
  bonusResource?: Array<Resource>;

  /**
   * The resources held in reserve when paying for a card.
   *
   * Cards that require a unit of steel while playing, for instance. Added for the expansion
   * The Moon but is used elsewhere.
   */
  reserveUnits?: Units;

  /** The generation the card was activated. Used for Duncan and Underworld cards. */
  generationUsed?: number;
}

export function isIProjectCard(card: ICard): card is IProjectCard {
  return card.type === CardType.AUTOMATED ||
    card.type === CardType.ACTIVE ||
    card.type === CardType.EVENT;
}
