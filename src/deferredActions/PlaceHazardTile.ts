import {Game} from '../Game';
import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {_AresHazardPlacement} from '../ares/AresHazards';
import {LogHelper} from '../LogHelper';
import {TileType} from '../TileType';
import {CardName} from '../CardName';
import {SelectProductionToLoseDeferred} from './SelectProductionToLoseDeferred';

export interface HazardOptions {
  collectBonuses?: boolean,
  productionPenalty?: boolean
 }

export class PlaceHazardTile implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for hazard tile',
        public spaces: Array<ISpace> = [],
        public options: HazardOptions = {},
  ) {}

  public execute() {
    if (this.spaces.length === 0) {
      return undefined;
    }

    return new SelectSpace(this.title, this.spaces, (foundSpace: ISpace) => {
      const tileType = Math.floor(Math.random() * 2) === 0 ? TileType.DUST_STORM_MILD : TileType.EROSION_MILD;
      _AresHazardPlacement.putHazardAt(foundSpace, tileType);

      if (this.options.collectBonuses) {
        foundSpace.bonus.forEach((spaceBonus) => this.game.grantSpaceBonus(this.player, spaceBonus));  
      }

      if (this.options.productionPenalty) {
        this.game.board.getAdjacentSpaces(foundSpace).forEach((space) => {
          if (space.player !== undefined && space.player !== this.player) {
            if (!space.player.isCorporation(CardName.ATHENA)) {
              this.game.defer(new SelectProductionToLoseDeferred(space.player, 1));
            }
          }
        });
      }

      LogHelper.logTilePlacement(this.player, foundSpace, tileType);
      return undefined;
    });
  }
}
