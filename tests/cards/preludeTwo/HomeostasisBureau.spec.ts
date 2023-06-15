import {expect} from 'chai';
import {HomeostasisBureau} from '../../../src/cards/preludeTwo/HomeostasisBureau';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {Phase} from '../../../src/Phase';

describe('HomeostasisBureau', function() {
  let card : HomeostasisBureau; let player : Player; let game: Game;

  beforeEach(() => {
    card = new HomeostasisBureau();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.HEAT)).eq(2);
  });

  it('Gives 3 M€ for each step you raise temperature', function() {
    player.playedCards.push(card);

    game.increaseTemperature(player, 1);
    expect(player.megaCredits).eq(3);

    game.increaseTemperature(player, 2);
    expect(player.megaCredits).eq(9);
  });

  it('Does not give 3 M€ for WGT raising temperature', function() {
    player.playedCards.push(card);
    game.phase = Phase.SOLAR;

    game.increaseTemperature(player, 1);
    expect(player.megaCredits).eq(0);
  });
});
