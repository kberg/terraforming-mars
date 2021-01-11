import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';

export class Sabotage implements IGlobalEvent {
    public name = GlobalEventName.SABOTAGE;
    public description = 'Decrease steel and energy production 1 step each. Gain 1 steel per influence.';
    public revealedDelegate = PartyName.UNITY;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.adjustProductionUnits({
          steel: -1,
          energy: -1,
        },
        {globalEvent: true});
        player.addSteel(turmoil.getPlayerInfluence(player), {globalEvent: true});
      });
    }
}
