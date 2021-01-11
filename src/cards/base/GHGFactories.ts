import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GHGFactories extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GHG_FACTORIES,
      tags: [Tags.BUILDING],
      cost: 11,
      hasRequirements: false,

      metadata: {
        cardNumber: '126',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().heat(4).digit;
          });
        }),
        description: 'Decrease your Energy production 1 step and increase your heat production 4 steps.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.energyProduction >= 1;
  }
  public play(player: Player) {
    player.addEnergyProduction(-1);
    player.addHeatProduction(4);
    return undefined;
  }
}
