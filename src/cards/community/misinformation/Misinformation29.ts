import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../CardType';
import {CardName} from '../../../CardName';

export class Misinformation29 extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MISINFORMATION_29,
      cost: 0,

      metadata: {
        cardNumber: 'Z02',
      },
    });
  }

  public play() {
    return undefined;
  }
}
