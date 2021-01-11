import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';

export class RedInfluence implements IGlobalEvent {
    public name = GlobalEventName.RED_INFLUENCE;
    public description = 'Lose 3 MC for each set of 5 TR over 10 (max 5 sets). Increase MC production 1 step per influence.';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const amount = Math.floor((player.getTerraformRating() - 10)/5);
        if (amount > 0) {
          player.addMegacredits(amount * -3, {globalEvent: true});
        }
        player.addMegacreditProduction(turmoil.getPlayerInfluence(player), {globalEvent: true});
      });
    }
}
