import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../../src/cards/base/ColonizerTrainingCamp';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('ColonizerTrainingCamp', function() {
  let card : ColonizerTrainingCamp; let player : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new ColonizerTrainingCamp();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    game.setOxygenLevel(6);
    expect(card.canPlay(player)).is.false;
  });
  it('Should play', function() {
    game.setOxygenLevel(5);
    expect(card.canPlay(player)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(2);
  });
});
