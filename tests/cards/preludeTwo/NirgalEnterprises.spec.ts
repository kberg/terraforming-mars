import {expect} from 'chai';
import {NirgalEnterprises} from '../../../src/cards/preludeTwo/NirgalEnterprises';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('NirgalEnterprises', function() {
  let card : NirgalEnterprises; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new NirgalEnterprises();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.getProduction(Resources.STEEL)).eq(1);
  });

  it('Corp owner can claim milestones for free', function() {
    player.corporationCards = [card];
    player.megaCredits = 0;
    expect(player.canAffordMilestone()).is.true;
  });

  it('Corp owner can fund awards for free', function() {
    player.corporationCards = [card];
    player.megaCredits = 0;
    expect(game.getAwardFundingCost(player)).eq(0);
  });
});
