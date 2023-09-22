import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../requirements/CardRequirements';

export class Nightclubs extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NIGHTCLUBS,
      cost: 11,
      tags: [Tag.BUILDING],

      requirements: CardRequirements.builder((b) => b.cities(1)),

      behavior: {
        production: {megacredits: 2},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U07',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).production((pb) => pb.megacredits(2));
        }),
        description: 'Requires that you own a city in play. Gain 1 corruption and increase your M€ production 2 steps.',
      },
    });
  }
}
