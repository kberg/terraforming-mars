import {expect} from "chai";
import {Caesar} from "../../src/cards/leaders/Caesar";
import {Game} from "../../src/Game";
import {SelectSpace} from "../../src/inputs/SelectSpace";
import {Player} from "../../src/Player";
import {ARES_OPTIONS_NO_HAZARDS} from "../ares/AresTestHelper";
import {EmptyBoard} from "../ares/EmptyBoard";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Caesar', function() {
  let card: Caesar; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Caesar();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Takes action', function() {
    game.generation = 3;
    card.action(player);
    expect(game.deferredActions).has.lengthOf(3);

    for (let i = 0; i < 3; i++) {
      const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
      placeHazard.cb(placeHazard.availableSpaces[0]);
    }

    expect(player.megaCredits).to.eq(6);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
