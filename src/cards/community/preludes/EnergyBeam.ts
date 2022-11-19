import {Tags} from '../../Tags';
import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Resources} from '../../../Resources';

export class EnergyBeam extends PreludeCard {
  constructor() {
    super({
      name: CardName.ENERGY_BEAM,
      tags: [Tags.ENERGY],
      metadata: {
        cardNumber: 'Y34',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(-1).energy(2).heat(2);
          });
        }),
        description: 'Decrease your M€ production 1 step. Increase your energy and heat production 2 steps each.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addProduction(Resources.ENERGY, 2);
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  };
}

