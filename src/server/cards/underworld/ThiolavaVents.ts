import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

export class ThiolavaVents extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.THIOLAVA_VENTS,
      cost: 13,
      tags: [Tag.MICROBE],
      resourceType: CardResource.MICROBE,

      requirements: {oceans: 1},

      victoryPoints: {resourcesHere: {}, per: 3},

      behavior: {
        production: {heat: 2},
      },

      metadata: {
        cardNumber: 'U90',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each time you increase your heat production, (including this card) put 1 microbe on this card.',
            (eb) => eb.production((pb) => pb.heat(1)).startEffect.microbes(1));
          b.br;
          b.production((pb) => pb.heat(2));
        }),
        description: 'Requires an ocean. Increase your heat production 2 steps. ' +
          '1 VP per 3 microbes on this card.',
      },
    });
  }

  public static resourceHook(player: IPlayer, resource: Resource, amount: number) {
    // TODO(kberg): Remove this underworldExpansion block if possible.
    if (player.game.gameOptions.underworldExpansion === false) {
      return;
    }
    if (amount < 0 || resource !== Resource.HEAT) {
      return;
    }
    const [holder, card] = player.game.getCardHolder(CardName.THIOLAVA_VENTS);
    if (holder === player && card !== undefined) {
      player.addResourceTo(card, {qty: amount, log: true});
    }
  }
}