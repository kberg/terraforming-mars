import {expect} from "chai";
import {NaturalPreserveAres} from "../../src/cards/ares/NaturalPreserveAres";
import {Gaia} from "../../src/cards/leaders/Gaia";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {TileType} from "../../src/TileType";
import {ARES_OPTIONS_NO_HAZARDS} from "../ares/AresTestHelper";
import {EmptyBoard} from "../ares/EmptyBoard";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Gaia', function() {
  let card: Gaia; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Gaia();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Takes action', function() {
    // Place a tile that grants adjacency bonuses
    const naturalPreserveAres = new NaturalPreserveAres();
    const action = naturalPreserveAres.play(player);
    game.deferredActions.runNext();
    const targetSpace = game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(targetSpace);

    // Place tiles from different players next to tile that grants adjacency bonuses
    const firstAdjacentSpace = game.board.getAdjacentSpaces(targetSpace)[0];
    const secondAdjacentSpace = game.board.getAdjacentSpaces(targetSpace)[1];
    game.addTile(player, firstAdjacentSpace.spaceType, firstAdjacentSpace, {tileType: TileType.GREENERY});
    game.addTile(player2, secondAdjacentSpace.spaceType, secondAdjacentSpace, {tileType: TileType.GREENERY});

    // Gain adjacency bonuses of all players' tiles
    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(2);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
