import {expect} from "chai";
import {EarthOffice} from "../../src/cards/base/EarthOffice";
import {Research} from "../../src/cards/base/Research";
import {SpecialDesign} from "../../src/cards/base/SpecialDesign";
import {TransNeptuneProbe} from "../../src/cards/base/TransNeptuneProbe";
import {LunaGovernor} from "../../src/cards/colonies/LunaGovernor";
import {Faraday} from "../../src/cards/leaders/Faraday";
import {Tags} from "../../src/cards/Tags";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {TestPlayers} from "../TestPlayers";

describe('Faraday', function() {
  let card: Faraday; let player: Player; let player2: Player;

  beforeEach(() => {
    card = new Faraday();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Draws a card when reaching a multiple of 4 for a tag', function() {
    player.playedCards.push(new Research());
    player.playCard(new TransNeptuneProbe());
    // 3 tags: Not sufficient
    expect(player.cardsInHand).has.length(0);

    // 4 tags: Draw a card with a Science tag
    player.playCard(new TransNeptuneProbe());
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tags.SCIENCE)).is.true;
  });

  it('Edge case: Play a card with two of the same tag', function() {
    player.playedCards.push(new EarthOffice(), new LunaGovernor());
    expect(player.cardsInHand).has.length(0);

    // Go directly from 3 to 5 tags: Draw a card with an Earth tag
    player.playCard(new LunaGovernor());
    expect(player.getTagCount(Tags.EARTH)).to.eq(5);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags.includes(Tags.EARTH)).is.true;
  });

  it('Does not trigger on event cards', function() {
    player.playedCards.push(new Research());
    player.playCard(new TransNeptuneProbe());
    player.playCard(new SpecialDesign());
    expect(player.cardsInHand).has.length(0);
  });
});
