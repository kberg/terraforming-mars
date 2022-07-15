import {expect} from 'chai';
import {NuclearZone} from '../../../src/cards/base/NuclearZone';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {TileType} from '../../../src/TileType';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('NuclearZone', function() {
  let card: NuclearZone; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new NuclearZone();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
  });

  it('Should play', function() {
    const action = card.play(player);
    game.deferredActions.runNext();

    if (action !== undefined) {
      const space = action.availableSpaces[0];
      action.cb(space);
      expect(space.tile && space.tile.tileType).eq(TileType.NUCLEAR_ZONE);
      player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
      expect(player.victoryPointsBreakdown.victoryPoints).eq(-2);
      expect(space.adjacency?.cost).eq(undefined);
    }
    expect(game.getTemperature()).eq(-26);
  });

  it('Respects Reds', function() {
    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST * 2;
    expect(player.canPlay(card)).is.true;
  });
});
