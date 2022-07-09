import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class BasicInfrastructure extends PreludeCard {
  constructor() {
    super({
      name: CardName.BASIC_INFRASTRUCTURE,
      tags: [Tags.MOON],

      metadata: {
        description: 'Place a road tile on the Moon and raise the Logistics Rate 1 step. Gain 1 trade fleet.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.moonRoad().secondaryTag(AltSecondaryTag.MOON_LOGISTICS_RATE).tradeFleet();
        }),
      },
    });
  };

  public play(player: Player) {
    player.game.defer(new PlaceMoonRoadTile(player));
    player.increaseFleetSize();
    return undefined;
  }
}
