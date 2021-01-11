import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class EarlySettlement extends PreludeCard {
    public tags = [Tags.BUILDING, Tags.CITY];
    public name = CardName.EARLY_SETTLEMENT;
    public play(player: Player, game: Game) {
      player.addPlantProduction(1);
      game.defer(new PlaceCityTile(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P09',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.plants(1)).city();
      }),
      description: 'Increase your plant production 1 step. Place a city tile.',
    }
}

