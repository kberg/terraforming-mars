import {expect} from "chai";
import {BigAsteroid} from "../../src/cards/base/BigAsteroid";
import {Greta} from "../../src/cards/leaders/Greta";
import {Omnicourt} from "../../src/cards/venusNext/Omnicourt";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Greta', function() {
  let card: Greta; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Greta();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Gains 4 M€ per TR raise action when OPG action is used', function() {
    card.action();

    player.playCard(new BigAsteroid());
    expect(player.megaCredits).to.eq(4);

    player.playCard(new Omnicourt());
    expect(player.megaCredits).to.eq(8);

    player.game.increaseOxygenLevel(player, 1);
    expect(player.megaCredits).to.eq(12);

    player.game.increaseVenusScaleLevel(player, 1);
    expect(player.megaCredits).to.eq(16);
  });

  it('Can only act once per game', function() {
    card.action();
    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
