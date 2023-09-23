import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {Tile} from '../Tile';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {SpaceId} from '../../common/Types';
import {IPlayer} from '../IPlayer';
import {ExcavationToken} from '../../common/underworld/ExcavationToken';

export type Space = {
    id: SpaceId;
    spaceType: SpaceType;
    tile?: Tile;
    player?: IPlayer;
    bonus: Array<SpaceBonus>;
    adjacency?: AdjacencyBonus,
    x: number;
    y: number;
    undergroundResources?: ExcavationToken;
    excavator?: IPlayer;
}

export function newSpace(
  id: SpaceId,
  spaceType: SpaceType,
  x: number,
  y: number,
  bonus: Array<SpaceBonus>): Space {
  return {id, spaceType, x, y, bonus};
}
