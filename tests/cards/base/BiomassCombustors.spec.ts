import {expect} from 'chai';
import {BiomassCombustors} from '../../../src/cards/base/BiomassCombustors';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('BiomassCombustors', function() {
  let card : BiomassCombustors; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new BiomassCombustors();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot play if oxygen requirement not met', function() {
    player2.addProduction(Resources.PLANTS, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if no one has plant production', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play in solo mode if oxygen requirement is met', function() {
    const game = Game.newInstance('foobar', [player], player);
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 6;
    player2.addProduction(Resources.PLANTS, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).eq(2);
    expect(player2.getProduction(Resources.PLANTS)).eq(0);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(-1);
  });
});
