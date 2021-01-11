import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';

export class SuccessfulOrganisms implements IGlobalEvent {
    public name = GlobalEventName.SUCCESSFUL_ORGANISMS;
    public description = 'Gain 1 plant per plant production (max 5) and influence.';
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.SCIENTISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.addPlants(Math.min(5, player.plantProduction) + turmoil.getPlayerInfluence(player), {globalEvent: true});
      });
    }
}
