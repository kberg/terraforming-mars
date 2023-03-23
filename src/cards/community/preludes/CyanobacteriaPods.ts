import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {Resources} from '../../../Resources';
import {CardRenderer} from '../../render/CardRenderer';
import {Tags} from '../../Tags';
import {SelectHowToPayDeferred} from '../../../deferredActions/SelectHowToPayDeferred';

export class CyanobacteriaPods extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.CYANOBACTERIA_PODS,
      tags: [Tags.MICROBE],

      metadata: {
        cardNumber: 'Y43',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(2));
          b.plants(2).megacredits(-6);
        }),
        description: 'Increase your plant production 2 steps. Gain 2 plants. Pay 6 M€.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 2);
    player.addResource(Resources.PLANTS, 2);
    player.game.defer(new SelectHowToPayDeferred(player, 6));
    return undefined;
  }
}
