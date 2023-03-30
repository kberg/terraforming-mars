import {CardType} from './CardType';
import {Player} from '../Player';
import {ICardMetadata} from './ICardMetadata';
import {CardName} from '../CardName';
import {Card} from './Card';
import {IActionCard, ICard, TRSource} from './ICard';
import {PlayerInput} from '../PlayerInput';

interface StaticTurmoilActionCardProperties {
  name: CardName,
  metadata: ICardMetadata,
  tr?: TRSource,
}

export abstract class TurmoilActionCard extends Card implements IActionCard, ICard {
  constructor(properties: StaticTurmoilActionCardProperties) {
    super({
      cardType: CardType.STANDARD_ACTION,
      ...properties,
    });
  }

  public abstract canAct(player: Player): boolean

  public abstract action(player: Player): PlayerInput | undefined

  public play() {
    return undefined;
  }
}
