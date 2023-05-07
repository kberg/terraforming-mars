import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';

export class Misinformation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MISINFORMATION,
      cost: 5,

      metadata: {
        cardNumber: 'Z02',
        description: 'This card cannot be played',
      },
    });
  }

  public canPlay() {
    return false;
  }
  
  public play() {
    return undefined;
  }
}
