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

  it('Corp owner always claim extra milestones', function() {
    player.corporationCards = [card];
    game.claimedMilestones.push({player: player, milestone: game.milestones[0]});
    game.claimedMilestones.push({player: player2, milestone: game.milestones[1]});
    game.claimedMilestones.push({player: player2, milestone: game.milestones[2]});

    expect(player2.canClaimMilestone()).is.false;
    expect(player.canClaimMilestone()).is.true;
  });

  it('Corp owner always fund extra awards', function() {
    player.corporationCards = [card];
    game.fundedAwards.push({player: player, award: game.awards[0]});
    game.fundedAwards.push({player: player2, award: game.awards[1]});
    game.fundedAwards.push({player: player2, award: game.awards[2]});

    expect(player2.canFundAward()).is.false;
    expect(player.canFundAward()).is.true;
  });
});
