import {expect} from "chai";
import {Research} from "../../src/cards/base/Research";
import {SpecialDesign} from "../../src/cards/base/SpecialDesign";
import {TransNeptuneProbe} from "../../src/cards/base/TransNeptuneProbe";
import {LunaGovernor} from "../../src/cards/colonies/LunaGovernor";
import {Faraday} from "../../src/cards/leaders/Faraday";
import {Tags} from "../../src/cards/Tags";
import {Game} from "../../src/Game";
import {OrOptions} from "../../src/inputs/OrOptions";
import {Player} from "../../src/Player";
import {TestPlayers} from "../TestPlayers";

describe('Faraday', function() {
  let card: Faraday; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Faraday();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    player.megaCredits = 10;
    game = Game.newInstance('foobar', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Can draw a card when reaching a multiple of 5 for a tag', function() {
    player.playedCards.push(new Research());
    player.playedCards.push(new Research());
    // 4 tags: Not sufficient
    expect(player.cardsInHand).has.length(0);

    // 5 tags: Draw a card with a Science tag
    player.playCard(new TransNeptuneProbe());
    
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    game.deferredActions.runAll(() => {});

    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tags.SCIENCE)).is.true;
    expect(player.megaCredits).to.eq(7);
  });

  it('Can choose to do nothing when reaching a multiple of 5 for a tag', function() {
    player.playedCards.push(new Research());
    player.playedCards.push(new Research());
    player.playCard(new TransNeptuneProbe());
    
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[1].cb();
    game.deferredActions.runAll(() => {});

    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(10);
  });

  it('Auto resolves if player cannot afford to pay for card', function() {
    player.megaCredits = 2;
    player.playedCards.push(new Research());
    player.playedCards.push(new Research());
    player.playCard(new TransNeptuneProbe());

    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
    expect(player.megaCredits).to.eq(2);
  });

  it('Edge case: Play a card with two of the same tag', function() {
    player.playedCards.push(new LunaGovernor(), new LunaGovernor());
    expect(player.cardsInHand).has.length(0);

    // Go directly from 4 to 6 tags: Draw a card with an Earth tag
    player.playCard(new LunaGovernor());
    expect(player.getTagCount(Tags.EARTH)).to.eq(6);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    game.deferredActions.runAll(() => {});

    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tags.EARTH)).is.true;
    expect(player.megaCredits).to.eq(7);
  });

  it('Does not trigger on event cards', function() {
    player.playedCards.push(new Research(), new Research());
    player.playCard(new SpecialDesign());
    expect(game.deferredActions).has.length(0);
    expect(player.cardsInHand).has.length(0);
  });
});
