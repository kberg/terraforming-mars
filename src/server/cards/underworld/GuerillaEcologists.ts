import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class GuerillaEcologists extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GUERILLA_ECOLOGISTS,
      cost: 9,
      tags: [Tag.PLANT],

      requirements: {corruption: 1},

      behavior: {
        spend: {plants: 4},
        greenery: {ignorePlacementRestrictions: true},
      },

      metadata: {
        cardNumber: 'U89',
        renderData: CardRenderer.builder((b) => {
          b.plants(-4, {digit}).greenery().asterix();
        }),
        description: 'Requires 1 corruption. Pay 4 plants. Place a greenery tile IGNORING ADJACENCY RESTRICTIONS.',
      },
    });
  }
}
