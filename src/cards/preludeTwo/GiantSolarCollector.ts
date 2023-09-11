import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PreludeCard} from '../prelude/PreludeCard';
import {Tags} from '../Tags';

export class GiantSolarCollector extends PreludeCard {
  constructor() {
    super({
      name: CardName.GIANT_SOLAR_COLLECTOR,
      tags: [Tags.ENERGY, Tags.SPACE],
      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
          b.venus(1);
        }),
        description: 'Increase your energy production 2 steps. Raise Venus 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 2);
    player.game.increaseVenusScaleLevel(player, 1);

    return undefined;
  }
}

