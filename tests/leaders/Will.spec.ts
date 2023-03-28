import {expect} from "chai";
import {Ants} from "../../src/cards/base/Ants";
import {Birds} from "../../src/cards/base/Birds";
import {ICard} from "../../src/cards/ICard";
import {Will} from "../../src/cards/leaders/Will";
import {Game} from "../../src/Game";
import {SelectCard} from "../../src/inputs/SelectCard";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Will', function() {
  let card: Will; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Will();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    game = Game.newInstance('foobar', [player, player2], player);
    player.playedCards.push(card);
  });

  it('Takes OPG action', function() {
    const birds = new Birds();
    const ants = new Ants();
    player.playedCards.push(birds, ants);

    card.action(player);
    expect(game.deferredActions).has.length(4);

    // Add animals
    game.deferredActions.runNext();
    expect(birds.resourceCount).eq(2);

    // Add microbes
    game.deferredActions.runNext();
    expect(ants.resourceCount).eq(2);

    game.deferredActions.runNext(); // No Floater resource cards, skip

    // Add 2 resources to any card
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<ICard>;;
    selectCard.cb([selectCard.cards[1]]);
    expect(ants.resourceCount).eq(4);
  });

  it('Can only act once per game', function() {
    card.action(player);
    TestingUtils.forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
