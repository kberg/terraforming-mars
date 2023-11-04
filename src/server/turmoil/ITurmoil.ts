import {IPlayer} from '../IPlayer';
import {IParty} from './parties/IParty';

export interface ITurmoil {
  parties: ReadonlyArray<IParty>;
  getPlayerInfluence(player: IPlayer): number;

}
