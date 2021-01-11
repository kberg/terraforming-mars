import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SolarWindPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLAR_WIND_POWER,
      tags: [Tags.SCIENCE, Tags.SPACE, Tags.ENERGY],
      cost: 11,

      metadata: {
        cardNumber: '077',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).br.titanium(2);
        }),
        description: 'Increase your energy production 1 step and gain 2 titanium.',
      },
    });
  }
  public play(player: Player) {
    player.addEnergyProduction(1);
    player.addTitanium(2);
    return undefined;
  }
}
