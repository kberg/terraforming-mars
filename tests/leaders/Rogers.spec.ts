import {expect} from "chai";
import {Rogers} from "../../src/cards/leaders/Rogers";
import {IshtarMining} from "../../src/cards/venusNext/IshtarMining";
import {LocalShading} from "../../src/cards/venusNext/LocalShading";
import {VenusGovernor} from "../../src/cards/venusNext/VenusGovernor";
import {VenusianAnimals} from "../../src/cards/venusNext/VenusianAnimals";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Rogers', function() {
  let card: Rogers; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Rogers();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    player.playedCards.push(card);
    player.megaCredits = 30;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes OPG action', function() {
    card.action();
    expect(card.opgActionIsActive).is.true;

    // Has discount of 3 M€ when playing Venus tags
    expect(card.getCardDiscount(player, new LocalShading())).to.eq(3);
    expect(card.getCardDiscount(player, new VenusGovernor())).to.eq(6);

    // Can ignore global requirements on Venus cards this generation
    expect(game.getVenusScaleLevel()).to.eq(0);
    expect(new IshtarMining().canPlay(player)).is.true;
    expect(new VenusianAnimals().canPlay(player)).is.true;
  });

  it('Can only act once per game', function() {
    card.action();
    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.opgActionIsActive).is.false;
    expect(card.canAct()).is.false;
  });
});
