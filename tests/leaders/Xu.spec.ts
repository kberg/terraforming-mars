import {expect} from "chai";
import {Xu} from "../../src/cards/leaders/Xu";
import {ResearchCoordination} from "../../src/cards/prelude/ResearchCoordination";
import {IshtarMining} from "../../src/cards/venusNext/IshtarMining";
import {LocalShading} from "../../src/cards/venusNext/LocalShading";
import {VenusGovernor} from "../../src/cards/venusNext/VenusGovernor";
import {VenusianAnimals} from "../../src/cards/venusNext/VenusianAnimals";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Xu', function() {
  let card: Xu; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Xu();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    player.playedCards.push(card);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes OPG action', function() {
    player.playedCards.push(new VenusGovernor(), new VenusianAnimals(), new ResearchCoordination());
    player2.playedCards.push(new IshtarMining(), new LocalShading(), new ResearchCoordination());

    const action = card.action(player);
    expect(action).is.undefined;

    // Gains correct M€ amount:
    // 10 from own cards + CEO (including wild tag),
    // 4 from opponent cards (excluding wild tag),
    // 8 from having most Venus tags
    expect(player.megaCredits).to.eq(22);
  });

  it('Can only act once per game', function() {
    card.action(player);
    TestingUtils.forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});