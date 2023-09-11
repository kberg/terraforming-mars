import {expect} from 'chai';
import {GiantSolarCollector} from '../../../src/cards/preludeTwo/GiantSolarCollector';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game, GameOptions} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';

describe('GiantSolarCollector', function() {
  let card : GiantSolarCollector; let player : Player; let game: Game;

  beforeEach(() => {
    card = new GiantSolarCollector();
    player = TestPlayers.BLUE.newPlayer();
    
    const gameOptions = TestingUtils.setCustomGameOptions() as GameOptions;
    game = Game.newInstance('foobar', [player], player, gameOptions);
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(2);
    expect(game.getVenusScaleLevel()).eq(2);
  });
});
