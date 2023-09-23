import {ExcavationToken} from '../../common/underworld/ExcavationToken';

export type UnderworldData = {
  tokens: Array<ExcavationToken>;
};

export type UnderworldPlayerData = {
  corruption: number;
  excavationTiles: number;
}
