import {ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardType} from '../../../common/cards/CardType';
import {SerializedCard} from '../../SerializedCard';
import {Behavior} from '../../behavior/Behavior';

export interface ICorporationCard extends ICard {
  type: CardType.CORPORATION;
  initialActionText?: string;
  initialAction?(player: IPlayer): PlayerInput | undefined;
  firstAction?: Behavior,
  startingMegaCredits: number;
  cardCost?: number;
  /**
   * Called when |corpOwner| playes |corp|. This card is owned by |thisOwner|.
   *
   * Not called when |corp| is this card.
   */
  onCorpCardPlayedByAnyPlayer?(thisOwner: IPlayer, corp: ICorporationCard, corpOwner: IPlayer): PlayerInput | undefined | void;
  onCorpCardPlayed?: never;
  onCardPlayedForCorps?(player: IPlayer, card: ICard): PlayerInput | undefined | void;

  serialize?(serialized: SerializedCard): void;
  deserialize?(serialized: SerializedCard): void;
}

export function isICorporationCard(card: ICard): card is ICorporationCard {
  return card.type === CardType.CORPORATION;
}
