import {expect} from "chai";
import {Duncan} from "../../src/cards/leaders/Duncan";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Duncan', function() {
  let card: Duncan; let player: Player; let player2: Player;

  beforeEach(() => {
    card = new Duncan();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    player.playedCards.push(card);
  });

  it('Has 5 VP and 4 MC in gen 1', function() {
    card.action(player);
    expect(player.getVictoryPoints().total).eq(25);
    expect(player.megaCredits).eq(4);
  });

  it('Has -2 VP and 32 MC in gen 8', function() {
    for (let i = 0; i < 7; i++) {
      TestingUtils.forceGenerationEnd(player.game);
    }

    player.megaCredits = 0;
    card.action(player);
    expect(player.getVictoryPoints().total).eq(18);
    expect(player.megaCredits).eq(32);
  });

  it('Does not affect VP if OPG action not used yet', function() {
    expect(player.getVictoryPoints().total).eq(20);
  });

  it('Can only act once per game', function() {
    card.action(player);
    TestingUtils.forceGenerationEnd(player.game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
