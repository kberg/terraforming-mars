import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';

export class AquiferReleasedByPublicCouncil implements IGlobalEvent {
    public name = GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL;
    public description = 'First player places an ocean tile. Gain 1 plant and 1 steel per influence.';
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.defer(new PlaceOceanTile(game.getPlayers()[0], game, 'Select Ocean for Global Event'));
      game.getPlayers().forEach((player) => {
        player.addPlants(turmoil.getPlayerInfluence(player), {globalEvent: true});
        player.addSteel(turmoil.getPlayerInfluence(player), {globalEvent: true});
      });
    }
}
