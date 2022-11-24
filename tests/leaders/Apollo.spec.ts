import {expect} from "chai";
import {Apollo} from "../../src/cards/leaders/Apollo";
import {Game} from "../../src/Game";
import {IMoonData} from "../../src/moon/IMoonData";
import {MoonExpansion} from "../../src/moon/MoonExpansion";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Apollo', function() {
  let card: Apollo; let player: Player; let player2: Player; let game: Game;
  let moonData: IMoonData;

  beforeEach(() => {
    card = new Apollo();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({moonExpansion: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    moonData = MoonExpansion.moonData(game);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action: Gains 3 M€ for each Moon tile', function() {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    MoonExpansion.addColonyTile(player, spaces[0].id);
    MoonExpansion.addMineTile(player2, spaces[1].id);
    MoonExpansion.addRoadTile(player2, spaces[2].id);

    card.action(player);
    expect(player.megaCredits).eq(9);
  });

  it('Can only act once per game', function() {
    card.action(player);
    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
