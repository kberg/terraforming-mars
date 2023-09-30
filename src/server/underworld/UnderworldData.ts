import {UndergroundResourceToken} from '../../common/underworld/UndergroundResourceToken';

export type UnderworldData = {
  tokens: Array<UndergroundResourceToken>;
};

export type UnderworldPlayerData = {
  corruption: number;
  excavationTiles: number;
}
