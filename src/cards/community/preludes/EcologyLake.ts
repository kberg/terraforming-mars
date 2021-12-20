import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {PlaceOceanTile} from '../../../deferredActions/PlaceOceanTile';
import {Resources} from '../../../Resources';
import {Tags} from '../../Tags';

export class EcologyLake extends PreludeCard {
  constructor() {
    super({
      name: CardName.ECOLOGY_LAKE,
      tags: [Tags.PLANT],

      metadata: {
        cardNumber: 'Y32',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).br;
          b.plants(5);
        }),
        description: 'Place an Ocean tile. Gain 5 plants.',
      },
    });
  }
  public play(player: Player) {
    player.addResource(Resources.PLANTS, 5, {log: true});
    player.game.defer(new PlaceOceanTile(player, 'Select space for ocean'));
    return undefined;
  }
}

