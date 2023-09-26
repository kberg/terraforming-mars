import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all, digit} from '../Options';

export class RecklessDetonation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.RECKLESS_DETONATION,
      cost: 1,

      requirements: {corruption: 2},

      behavior: {
        spend: {energy: 3},
        underworld: {excavate: 2},
      },

      metadata: {
        cardNumber: 'U06',
        renderData: CardRenderer.builder((b) => {
          b.excavate(1).minus().steel(3, {digit, all}).asterix().or().titanium(2, {digit, all}).asterix();
        }),
        description: 'Requires 2 corruption. Excavate an underground resources. Remove up to 3 steel or 2 titanium from another player.',
      },
    });
  }
}
