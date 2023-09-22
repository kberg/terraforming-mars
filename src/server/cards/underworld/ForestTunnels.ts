import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../requirements/CardRequirements';
import {Tag} from '../../../common/cards/Tag';

export class ForestTunnels extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FOREST_TUNNELS,
      tags: [Tag.PLANT],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.excavation()),

      behavior: {
        stock: {plants: {underworld: {excavationMarkers: {}}}},
      },

      metadata: {
        cardNumber: 'U16',
        renderData: CardRenderer.builder((b) => {
          b.plants(1).slash().excavate(1);
        }),
        description: 'Requires an excavation marker. Gain 1 plant for every excavation marker you have.',
      },
    });
  }
}
