import {Color} from '../Color';
import {TileType} from '../TileType';
import {SpaceBonus} from '../boards/SpaceBonus';
import {SpaceType} from '../boards/SpaceType';
import {SpaceId} from '../Types';
import {ResourceToken} from '../underworld/ResourceToken';

export type SpaceHighlight = undefined | 'noctis' | 'volcanic';

export type SpaceModel = {
  id: SpaceId;
  x: number;
  y: number;
  spaceType: SpaceType;

  bonus: Array<SpaceBonus>;
  color?: Color;
  tileType?: TileType;
  highlight?: SpaceHighlight;
  rotated?: true; // Absent or true
  gagarin?: number; // 0 means current
  cathedral?: true; // Absent or true
  nomads?: true; // Absent or true
  undergroundResources?: ResourceToken;
  excavator?: Color;
}
