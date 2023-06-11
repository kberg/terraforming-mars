import {expect} from "chai";
import {MicroMills} from "../../src/cards/base/MicroMills";
import {Research} from "../../src/cards/base/Research";
import {IProjectCard} from "../../src/cards/IProjectCard";
import {Stefan} from "../../src/cards/leaders/Stefan";
import {Game} from "../../src/Game";
import {SelectCard} from "../../src/inputs/SelectCard";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Stefan', function() {
  let card: Stefan; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Stefan();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot act', function() {
    game.generation = 5;
    player.megaCredits = 4;
    expect(card.canAct(player)).is.false;
  });

  it('Can act without cards in hand', function() {
    game.generation = 5;
    player.megaCredits = 5;
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    const research = new Research();
    const microMills = new MicroMills();
    player.cardsInHand.push(research, microMills);
    game.generation = 5;
    player.megaCredits = 5;

    const selectCard = card.action(player) as SelectCard<IProjectCard>;
    game.deferredActions.runAll(() => {});
    selectCard.cb([research, microMills]);
    expect(player.cardsInHand).has.length(5);
    expect(player.megaCredits).eq(6); // 5 - 5 cost to draw cards + 6 from selling 2 cards
  });

  it('Can only act once per game', function() {
    const research = new Research();
    player.cardsInHand.push(research);

    (card.action(player) as SelectCard<IProjectCard>).cb([research]);
    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
