import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';
import {Tag} from '../../../common/cards/Tag';

export class ConcessionRights extends Card implements IProjectCard {
  public generationUsed: number = -1;

  constructor() {
    super({
      name: CardName.CONCESSION_RIGHTS,
      type: CardType.EVENT,
      cost: 8,
      tags: [Tag.MARS],
      requirements: {tag: Tag.EARTH},
      victoryPoints: -1,

      behavior: {
        underworld: {
          markThisGeneration: {},
          excavate: 1,
          corruption: 1,
        },
      },

      metadata: {
        cardNumber: 'U32',
        renderData: CardRenderer.builder((b) => {
          b.plants(-2, {all}).asterix().corruption().asterix();
        }),
        description: 'Requires 1 Earth tag. Until the end of this generation, ' +
        'you can excavation any unclaimed underground resource on the map, ' +
        'ignoring placement restrictions. Excavation 1 underground resource. Gain 1 corruption.',
      },
    });
  }
}