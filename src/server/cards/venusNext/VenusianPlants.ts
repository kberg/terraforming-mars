import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class VenusianPlants extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.VENUSIAN_PLANTS,
      cost: 13,
      tags: [Tag.VENUS, Tag.PLANT],

      requirements: {venus: 16},
      victoryPoints: 1,

      behavior: {
        global: {venus: 1},
        addResourcesToAnyCard: {
          count: 1,
          tag: Tag.VENUS,
          type: [CardResource.ANIMAL, CardResource.MICROBE],
          autoSelect: true,
        },
      },

      metadata: {
        cardNumber: '261',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // intentional double br
          b.microbes(1, {secondaryTag: Tag.VENUS}).nbsp;
          b.or().nbsp.animals(1, {secondaryTag: Tag.VENUS});
        }),
        description: {
          text: 'Requires Venus 16%. Raise Venus 1 step. Add 1 microbe or 1 animal to ANOTHER VENUS CARD',
          align: 'left',
        },
      },
    });
  }
}
