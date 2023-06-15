import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {Units} from '../../Units';

export class HomeostasisBureau extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.HOMEOSTASIS_BUREAU,
      tags: [Tags.BUILDING],
      productionBox: Units.of({heat: 2}),
      cost: 16,

      metadata: {
        cardNumber: '??',
        description: 'Increase your heat production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you raise temperature, gain 3 M€.', (eb) => {
            eb.temperature(1).startEffect.megacredits(3);
          });
          b.br.br;
          b.production((pb) => pb.heat(2));
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  }
}
