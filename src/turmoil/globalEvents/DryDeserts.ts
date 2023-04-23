import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {SelectResourcesDeferred} from '../../deferredActions/SelectResourcesDeferred';

export class DryDeserts implements IGlobalEvent {
    public name = GlobalEventName.DRY_DESERTS;
    public description = 'First player removes 1 ocean tile from the gameboard. Gain 1 standard resource per influence.';
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
      const canRemoveOcean = game.canRemoveOcean();

      if (canRemoveOcean) {
        game.defer(new RemoveOceanTile(game.getPlayers()[0], 'Dry Deserts Global Event - Remove an Ocean tile from the board'));
      }

      game.getPlayers().forEach((player) => {
        const count = turmoil.getPlayerInfluence(player);
        if (count > 0) {
          game.defer(new SelectResourcesDeferred(
            player,
            count,
            'Dry Deserts Global Event - Gain ' + count + ' resource(s) for influence',
          ));
        }
      });
    }
}
