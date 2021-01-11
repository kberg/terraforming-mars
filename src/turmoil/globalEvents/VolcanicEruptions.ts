import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';

export class VolcanicEruptions implements IGlobalEvent {
    public name = GlobalEventName.VOLCANIC_ERUPTIONS;
    public description = 'Increase temperature 2 steps. Increase heat production 1 step per influence.';
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.increaseTemperature(game.getPlayers()[0], 2);
      game.getPlayers().forEach((player) => {
        const amount = turmoil.getPlayerInfluence(player);
        if (amount > 0) {
          player.addHeatProduction(amount, {globalEvent: true});
        }
      });
    }
}
