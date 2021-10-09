import {expect} from 'chai';
import {TundraFarming} from '../../../src/cards/base/TundraFarming';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('TundraFarming', function() {
  let card : TundraFarming; let player : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new TundraFarming();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -6;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
    expect(player.plants).eq(1);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(2);
  });
});
