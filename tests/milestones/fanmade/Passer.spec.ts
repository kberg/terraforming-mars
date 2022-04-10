import {expect} from "chai";
import {Game} from "../../../src/Game";
import {Passer} from "../../../src/milestones/fanmade/Passer";
import {Player} from "../../../src/Player";
import {TestingUtils} from "../../TestingUtils";
import {TestPlayers} from "../../TestPlayers";

describe('Passer', () => {
  let milestone : Passer; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    milestone = new Passer();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    game = Game.newInstance('test', [player, player2], player);
  });

  it('Cannot claim', () => {
    player.pass();
    TestingUtils.forceGenerationEnd(game);
    expect(player.consecutiveFirstPassCount).to.eq(1);
    expect(milestone.canClaim(player)).is.false;
    
    player2.pass();
    TestingUtils.forceGenerationEnd(game);
    expect(player2.consecutiveFirstPassCount).to.eq(1);
    expect(player.consecutiveFirstPassCount).to.eq(0);
    expect(milestone.canClaim(player)).is.false;
    expect(milestone.canClaim(player2)).is.false;
  });

  it('Can claim by being first player to pass twice consecutively', () => {
    player.pass();
    expect(player.consecutiveFirstPassCount).to.eq(1);
    TestingUtils.forceGenerationEnd(game);
    
    player.pass();
    expect(player.consecutiveFirstPassCount).to.eq(2);
    expect(milestone.canClaim(player)).is.true;
  });
});
