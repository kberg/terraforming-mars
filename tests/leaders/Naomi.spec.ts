import {expect} from "chai";
import {Naomi} from "../../src/cards/leaders/Naomi";
import {Callisto} from "../../src/colonies/Callisto";
import {Ceres} from "../../src/colonies/Ceres";
import {MAX_COLONY_TRACK_POSITION} from "../../src/constants";
import {Game} from "../../src/Game";
import {OrOptions} from "../../src/inputs/OrOptions";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Naomi', function() {
  let card: Naomi; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Naomi();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    // Setup some colonies that can be built independently of cards
    game.colonies = [new Callisto(), new Ceres()];
  });

  it('Gains 2 energy and 2 M€ when building a colony', function() {
    player.playedCards.push(card);
    game.colonies[0].addColony(player);
    expect(player.energy).to.eq(2);
    expect(player.megaCredits).to.eq(2);
  })

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });
  
  it('Takes action', function() {
    card.action(player);
    expect(game.deferredActions).has.length(3);

    const firstColony = game.deferredActions.pop()!.execute() as OrOptions;
    firstColony.options[0].cb();
    const secondColony = game.deferredActions.pop()!.execute() as OrOptions;
    secondColony.options[1].cb();

    expect(game.colonies[0].trackPosition).eq(MAX_COLONY_TRACK_POSITION);
    expect(game.colonies[game.colonies.length - 1].trackPosition).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);

    const firstColony = game.deferredActions.pop()!.execute() as OrOptions;
    firstColony.options[0].cb();
    const secondColony = game.deferredActions.pop()!.execute() as OrOptions;
    secondColony.options[1].cb();

    game.deferredActions.runAll(() => {});
    TestingUtils.forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});