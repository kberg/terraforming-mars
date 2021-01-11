import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Turmoil} from '../Turmoil';

export class HomeworldSupport implements IGlobalEvent {
    public name = GlobalEventName.HOMEWORLD_SUPPORT;
    public description = 'Gain 2 MC for each Earth tag (max 5) and influence.';
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const amount = Math.min(5, player.getTagCount(Tags.EARTH, false, false)) + turmoil.getPlayerInfluence(player);
        if (amount > 0) {
          player.addMegacredits(2 * amount, {globalEvent: true});
        }
      });
    }
}
