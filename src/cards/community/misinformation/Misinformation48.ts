import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../CardType';
import {CardName} from '../../../CardName';

export class Misinformation48 extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MISINFORMATION_48,
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
