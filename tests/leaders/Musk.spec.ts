import {expect} from "chai";
import {Cartel} from "../../src/cards/base/Cartel";
import {EarthOffice} from "../../src/cards/base/EarthOffice";
import {LunaGovernor} from "../../src/cards/colonies/LunaGovernor";
import {IProjectCard} from "../../src/cards/IProjectCard";
import {Musk} from "../../src/cards/leaders/Musk";
import {Tags} from "../../src/cards/Tags";
import {Game} from "../../src/Game";
import {SelectAmount} from "../../src/inputs/SelectAmount";
import {SelectCard} from "../../src/inputs/SelectCard";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Musk', function() {
  let card: Musk; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Musk();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can act without cards', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action', function() {
    player.cardsInHand.push(new EarthOffice(), new LunaGovernor(), new Cartel());

    const selectAmount = card.action(player) as SelectAmount;
    selectAmount.cb(3);
    const selectCardsToDiscard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    selectCardsToDiscard.cb([...selectCardsToDiscard.cards]);

    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(3);

    expect(player.cardsInHand.some((card) => !card.tags.includes(Tags.SPACE))).is.false;
    expect(player.titanium).to.eq(9);
  });

  it('Can only act once per game', function() {
    player.cardsInHand.push(new EarthOffice(), new LunaGovernor(), new Cartel());
    (card.action(player) as SelectAmount).cb(2);

    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
