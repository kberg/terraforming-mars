import {expect} from "chai";
import {_AresHazardPlacement} from "../../../src/ares/AresHazards";
import {Game} from "../../../src/Game";
import {Purifier} from "../../../src/milestones/fanmade/Purifier";
import {Player} from "../../../src/Player";
import {TileType} from "../../../src/TileType";
import {TestingUtils} from "../../TestingUtils";
import {TestPlayers} from "../../TestPlayers";

describe('Purifier', () => {
  let milestone : Purifier; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    milestone = new Purifier();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({aresExtension: true, aresHazards: true});
    game = Game.newInstance('test', [player, player2], player, gameOptions);
    // Ensure enough to pay for placing tiles on top of hazards
    player.megaCredits = 50;

    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);
    game.addGreenery(player, firstSpace.id);
    game.deferredActions.runAll(() => {});

    const secondSpace = game.board.getAvailableSpacesOnLand(player)[1];
    _AresHazardPlacement.putHazardAt(secondSpace, TileType.DUST_STORM_MILD);
    game.addGreenery(player, secondSpace.id);
    game.deferredActions.runAll(() => {});
  });

  it('Cannot claim', () => {
    expect(milestone.getScore(player)).eq(2);
    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim', () => {
    const thirdSpace = game.board.getAvailableSpacesOnLand(player)[2];
    _AresHazardPlacement.putHazardAt(thirdSpace, TileType.DUST_STORM_MILD);
    game.addGreenery(player, thirdSpace.id);
    game.deferredActions.runAll(() => {});

    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.true;
  });
});
