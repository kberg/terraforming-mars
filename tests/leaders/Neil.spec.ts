import {expect} from "chai";
import {Neil} from "../../src/cards/leaders/Neil";
import {LTFPrivileges} from "../../src/cards/moon/LTFPrivileges";
import {ThoriumRush} from "../../src/cards/moon/ThoriumRush";
import {Game} from "../../src/Game";
import {MoonExpansion} from "../../src/moon/MoonExpansion";
import {Player} from "../../src/Player";
import {Resources} from "../../src/Resources";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Neil', function() {
  let card: Neil; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Neil();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({moonExpansion: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
  });

  it('Play', function() {
    card.play(player);
    expect(player.megaCredits).to.eq(1);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action: Gains M€ production equal to lowest Moon rate', function() {
    MoonExpansion.raiseColonyRate(player, 5);
    MoonExpansion.raiseLogisticRate(player, 2);
    MoonExpansion.raiseMiningRate(player, 1);

    card.action(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
  });

  it('Gains 1 M€ when any player plays a Moon tag', function() {
    player.playedCards.push(card);

    card.onCardPlayed(player, new LTFPrivileges());
    expect(player.megaCredits).eq(1);

    card.onCardPlayed(player2, new ThoriumRush());
    expect(player.megaCredits).eq(2);
  });

  it('Can only act once per game', function() {
    card.action(player);
    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
