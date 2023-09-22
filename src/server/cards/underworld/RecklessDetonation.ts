import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';
// import {CardRequirements} from '../requirements/CardRequirements';

export class RecklessDetonation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.RECKLESS_DETONATION,
      cost: 1,

      // requirements: CardRequirements.builder((b) => b.corruption(2)),

      behavior: {
        spend: {energy: 3},
        underworld: {excavate: 2},
      },

      metadata: {
        cardNumber: 'U06',
        renderData: CardRenderer.builder((b) => {
          b.excavate(1).minus().steel(3, {all}).asterix().or().titanium(2, {all}).asterix();
        }),
        description: 'Requires 2 corruption. Excavate an underground resources. Remove up to 3 steel or 2 titanium from another player.',
      },
    });
  }
}
