import {expect} from "chai";
import {Huan} from "../../src/cards/leaders/Huan";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Huan', function() {
  let card: Huan; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Huan();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player.playedCards.push(card);

    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
  });

  it('Takes action', function() {
    game.colonies[0].trade(player);
    game.colonies[1].trade(player2);

    expect(player.tradesThisGeneration).eq(1);
    expect(player2.tradesThisGeneration).eq(1);
    expect(game.colonies[0].visitor).eq(player.id);
    expect(game.colonies[1].visitor).eq(player2.id);

    // Blocks opponents from trading, but clears all colony visitors
    card.action(player);
    TestingUtils.forceGenerationEnd(game);

    expect(player.tradesThisGeneration).eq(0);
    expect(player2.tradesThisGeneration).eq(50);
    expect(game.colonies[0].visitor).is.undefined;
    expect(game.colonies[1].visitor).is.undefined;
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
