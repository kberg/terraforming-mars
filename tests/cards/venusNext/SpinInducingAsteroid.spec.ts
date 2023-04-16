import {expect} from 'chai';
import {MorningStarInc} from '../../../src/cards/venusNext/MorningStarInc';
import {SpinInducingAsteroid} from '../../../src/cards/venusNext/SpinInducingAsteroid';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('SpinInducingAsteroid', function() {
  let card : SpinInducingAsteroid; let player : Player; let game : Game;

  beforeEach(() => {
    card = new SpinInducingAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    game.setVenusScaleLevel(12);
    expect(card.canPlay(player)).is.false;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(game.getVenusScaleLevel()).eq(4);
  });

  it('Should play with Morning Star', function() {
    player.corporationCards = [new MorningStarInc()];
    game.setVenusScaleLevel(12);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.getVenusScaleLevel()).eq(16);
  });
});
