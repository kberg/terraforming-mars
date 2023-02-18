import {expect} from "chai";
import {AdvancedAlloys} from "../../src/cards/base/AdvancedAlloys";
import {Comet} from "../../src/cards/base/Comet";
import {ProtectedValley} from "../../src/cards/base/ProtectedValley";
import {TerraformingGanymede} from "../../src/cards/base/TerraformingGanymede";
import {IProjectCard} from "../../src/cards/IProjectCard";
import {Buck} from "../../src/cards/leaders/Buck";
import {Game} from "../../src/Game";
import {SelectCard} from "../../src/inputs/SelectCard";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Buck', function() {
  let card: Buck; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Buck();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot act', function() {
    expect(card.canAct(player)).is.false;

    player.playedCards.push(new AdvancedAlloys(), new Comet());
    expect(card.canAct(player)).is.false;

    const playedCard = new ProtectedValley();
    player.playedCards.push(playedCard);
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action', function() {
    const playedCard = new TerraformingGanymede();
    player.playedCards.push(playedCard);
    expect(card.canAct(player)).is.true;

    const selectCard = card.action(player) as SelectCard<IProjectCard>;
    selectCard.cb([playedCard]);

    expect(player.playedCards).has.length(0);
    expect(player.cardsInHand).has.length(1);
  });

  it('Can only act once per game', function() {
    const playedCard = new TerraformingGanymede();
    player.cardsInHand.push(playedCard);

    (card.action(player) as SelectCard<IProjectCard>).cb([playedCard]);
    TestingUtils.forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
