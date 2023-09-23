import {ResourceToken} from '../../common/underworld/ResourceToken';

export type UnderworldData = {
  tokens: Array<ResourceToken>;
};

export type UnderworldPlayerData = {
  corruption: number;
  excavationTiles: number;
}
