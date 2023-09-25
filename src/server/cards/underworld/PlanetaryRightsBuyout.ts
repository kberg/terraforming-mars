import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../requirements/CardRequirements';

export class PlanetaryRightsBuyout extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PLANETARY_RIGHTS_BUYOUT,
      type: CardType.EVENT,
      cost: 28,

      behavior: {
        underworld: {corruption: 2},
      },

      requirements: CardRequirements.builder((b) => b.corruption(5)),
      victoryPoints: -3,

      metadata: {
        cardNumber: 'U85',
        renderData: CardRenderer.builder((b) => {
          b.tr(7);
        }),
        description: 'Requires 5 corruption. Gain 7 TR',
      },
    });
  }
}
