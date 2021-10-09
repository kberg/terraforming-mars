import {expect} from 'chai';
import {HugeAsteroid} from '../../../src/cards/prelude/HugeAsteroid';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('HugeAsteroid', function() {
  let card : HugeAsteroid; let player : Player; let game : Game;

  beforeEach(() => {
    card = new HugeAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    player.megaCredits = 4;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.true;
    const initialTR = player.getTerraformRating();

    card.play(player);

    // SelectHowToPayDeferred
    game.deferredActions.runNext();

    expect(player.megaCredits).eq(0);
    expect(player.getProduction(Resources.HEAT)).eq(1);
    expect(player.getTerraformRating()).eq(initialTR + 3);
  });
});
