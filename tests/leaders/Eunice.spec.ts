import {expect} from "chai";
import {IProjectCard} from "../../src/cards/IProjectCard";
import {Eunice} from "../../src/cards/leaders/Eunice";
import {DomeFarming} from "../../src/cards/prelude/DomeFarming";
import {MoholeExcavation} from "../../src/cards/prelude/MoholeExcavation";
import {ResearchNetwork} from "../../src/cards/prelude/ResearchNetwork";
import {SmeltingPlant} from "../../src/cards/prelude/SmeltingPlant";
import {Game} from "../../src/Game";
import {SelectCard} from "../../src/inputs/SelectCard";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Eunice', function() {
  let card: Eunice; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Eunice();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    player.playedCards.push(new DomeFarming(), new MoholeExcavation());
    player2.playedCards.push(new ResearchNetwork(), new SmeltingPlant());

    player.megaCredits = 20;
  });

  it('Can act', function() {
    player.megaCredits = 11;
    expect(card.canAct(player)).is.false;

    player.megaCredits = 12;
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    const action = card.action(player);
    expect(action).is.undefined;

    // Pay 12 M€
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(8);

    // Copy a prelude
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(selectCard.cards).has.length(4);
    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runNext();

    // Gain 3X M€
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(11);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});
    TestingUtils.forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
