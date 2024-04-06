import {Space} from './Space';
import {SpaceId, isSpaceId, safeCast} from '../../common/Types';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';
import {Random} from '../../common/utils/Random';
import {partition} from '../../common/utils/utils';
import {inplaceShuffle} from '../utils/shuffle';
import {MarsBoard} from './MarsBoard';
import {GameOptions} from '../game/GameOptions';

function colonySpace(id: SpaceId): Space {
  return {id, spaceType: SpaceType.COLONY, x: -1, y: -1, bonus: []};
}

type SpaceMetadata = {
  type: SpaceType;
  bonuses: Array<SpaceBonus>;
  noctisCity: boolean;
  volcanic: boolean;
  unshufflable: boolean;
}

export class BoardBuilder {
  // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
  //
  // "Son I am able, " she said "though you scare me."
  // "Watch, " said I
  // "Beloved, " I said "watch me scare you though." said she,
  // "Able am I, Son."

  private spaces: Array<SpaceMetadata> = [];

  constructor(private Ctor: typeof MarsBoard, private gameOptions: GameOptions, private rng: Random) {
  }

  private space(type: SpaceType, bonuses: Array<SpaceBonus>, extra: Partial<SpaceMetadata> = {}): SpaceMetadata {
    return {type, bonuses, noctisCity: false, volcanic: false, unshufflable: false, ...extra};
  }

  ocean(...bonus: Array<SpaceBonus>): this {
    this.spaces.push(this.space(SpaceType.OCEAN, bonus));
    return this;
  }

  cove(...bonus: Array<SpaceBonus>): this {
    this.spaces.push(this.space(SpaceType.COVE, bonus));
    return this;
  }

  coveVolcanic(...bonus: Array<SpaceBonus>): this {
    this.spaces.push(this.space(SpaceType.COVE, bonus, {volcanic: true}));
    return this;
  }

  land(...bonus: Array<SpaceBonus>): this {
    this.spaces.push(this.space(SpaceType.LAND, bonus));
    return this;
  }

  restricted(): this {
    this.spaces.push(this.space(SpaceType.RESTRICTED, [], {unshufflable: true}));
    return this;
  }

  unshufflable(): this {
    const top = this.spaces[this.spaces.length -1];
    top.unshufflable = true;
    return this;
  }

  noctisCity(...bonus: Array<SpaceBonus>): this {
    this.spaces.push(this.space(SpaceType.LAND, bonus, {noctisCity: true}));
    return this;
  }

  volcanic(...bonus: Array<SpaceBonus>): this {
    this.spaces.push(this.space(SpaceType.LAND, bonus, {volcanic: true}));
    return this;
  }

  build(): MarsBoard {
    if (this.gameOptions.shuffleMapOption) {
      this.shuffle(this.rng);
    }

    const spaces: Array<Space> = [
      colonySpace(SpaceName.GANYMEDE_COLONY),
      colonySpace(SpaceName.PHOBOS_SPACE_HAVEN),
    ];

    const tilesPerRow = [5, 6, 7, 8, 9, 8, 7, 6, 5];
    const idOffset = 2;
    let idx = 0;

    let noctisCitySpaceId: SpaceId | undefined = undefined;
    const volcanicSpaceIds: Array<SpaceId> = [];
    for (let y = 0; y < 9; y++) {
      const tilesInThisRow = tilesPerRow[y];
      const xOffset = 9 - tilesInThisRow;
      for (let i = 0; i < tilesInThisRow; i++) {
        const spaceId = idx + idOffset;
        const x = xOffset + i;
        const space = {
          id: BoardBuilder.spaceId(spaceId),
          spaceType: this.spaces[idx].type,
          x,
          y,
          bonus: this.spaces[idx].bonuses,
        };
        if (this.spaces[idx].noctisCity) {
          noctisCitySpaceId = space.id;
        }
        if (this.spaces[idx].volcanic) {
          volcanicSpaceIds.push(space.id);
        }
        spaces.push(space);
        idx++;
      }
    }

    spaces.push(colonySpace(SpaceName.STANFORD_TORUS));
    if (this.gameOptions.venusNextExtension) {
      spaces.push(
        colonySpace(SpaceName.DAWN_CITY),
        colonySpace(SpaceName.LUNA_METROPOLIS),
        colonySpace(SpaceName.MAXWELL_BASE),
        colonySpace(SpaceName.STRATOPOLIS),
      );
    }
    if (this.gameOptions.pathfindersExpansion) {
      spaces.push(
        // Space.colony(SpaceName.MARTIAN_TRANSHIPMENT_STATION),
        colonySpace(SpaceName.CERES_SPACEPORT),
        colonySpace(SpaceName.DYSON_SCREENS),
        colonySpace(SpaceName.LUNAR_EMBASSY),
        colonySpace(SpaceName.VENERA_BASE),
      );
    }

    return new this.Ctor(spaces, noctisCitySpaceId, volcanicSpaceIds);
  }

  // Shuffle the ocean spaces and bonus spaces. But protect the land spaces supplied by
  // |lands| so that those IDs most definitely have land spaces.
  public shuffle(rng: Random) {
    const byIndex = this.spaces.map((val, idx) => {
      return {val, idx};
    });
    const [unshufflable, shufflable] = partition(byIndex, ((e) => e.val.unshufflable || e.val.noctisCity || e.val.volcanic));
    inplaceShuffle(shufflable, rng);
    for (const space of unshufflable) {
      shufflable.splice(space.idx, 0, space);
    }

    this.spaces.length = 0;
    this.spaces.push(...shufflable.map((e) => e.val));
  }

  private static spaceId(id: number): SpaceId {
    let strId = id.toString();
    if (id < 10) {
      strId = '0'+strId;
    }
    return safeCast(strId, isSpaceId);
  }
}
