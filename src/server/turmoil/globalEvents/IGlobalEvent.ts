import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {ICardRenderRoot} from '../../../common/cards/render/Types';
import {IGame} from '../../IGame';
import {ITurmoil} from '../ITurmoil';

export interface IGlobalEvent {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: ICardRenderRoot;
  resolve(game: IGame, turmoil: ITurmoil): void;
}
