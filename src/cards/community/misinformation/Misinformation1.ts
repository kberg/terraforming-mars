import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../CardType';
import {CardName} from '../../../CardName';
import {Player} from '../../../Player';
import {Resources} from '../../../Resources';
import {CardRenderer} from '../../render/CardRenderer';

export class Misinformation1 extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MISINFORMATION_1,
      cost: 3,

      metadata: {
        cardNumber: 'Z02',
        description: 'Gain 3 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(3);
        }),
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
