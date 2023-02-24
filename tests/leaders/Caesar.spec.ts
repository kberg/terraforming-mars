import {expect} from "chai";
import {Caesar} from "../../src/cards/leaders/Caesar";
import {Game} from "../../src/Game";
import {SelectProductionToLose} from "../../src/inputs/SelectProductionToLose";
import {SelectSpace} from "../../src/inputs/SelectSpace";
import {Player} from "../../src/Player";
import {Resources} from "../../src/Resources";
import {Units} from "../../src/Units";
import {AresTestHelper, ARES_OPTIONS_NO_HAZARDS, ARES_OPTIONS_WITH_HAZARDS} from "../ares/AresTestHelper";
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
    game.generation = 3;
  });

  it('Takes action - 5 or less hazards', function() {
    card.action(player);
    expect(game.deferredActions).has.lengthOf(4);

    // Place 3 hazard tiles
    for (let i = 0; i < 3; i++) {
      const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
      placeHazard.cb(placeHazard.availableSpaces[i]);
    }

    const hazards = AresTestHelper.getHazards(player, game);
    expect(hazards.length).to.eq(3);

    game.deferredActions.runNext();

    // Opponents lose 1 production
    const input = game.deferredActions.pop()!.execute() as SelectProductionToLose;
    expect(input.unitsToLose).eq(1);
    input.cb(Units.of({megacredits: 1}));
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(-1);
  });

  it('Takes action - more than 5 hazards', function() {
    game = Game.newInstance('foobar', [player, player2], player, ARES_OPTIONS_WITH_HAZARDS);
    game.generation = 3;

    card.action(player);
    expect(game.deferredActions).has.lengthOf(4);

    // Place 3 hazard tiles
    for (let i = 0; i < 3; i++) {
      const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
      // Remove spaces that already have a hazard placed during game setup
      placeHazard.availableSpaces = placeHazard.availableSpaces.filter((s) => s.tile === undefined);
      placeHazard.cb(placeHazard.availableSpaces[i]);
    }

    const hazards = AresTestHelper.getHazards(player, game);
    expect(hazards.length).gte(5);

    game.deferredActions.runNext();

    // Opponents lose 2 production
    const input = game.deferredActions.pop()!.execute() as SelectProductionToLose;
    expect(input.unitsToLose).eq(2);
    input.cb(Units.of({megacredits: 2}));
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(-2);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
