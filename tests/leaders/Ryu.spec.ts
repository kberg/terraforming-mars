import {expect} from "chai";
import {Ryu} from "../../src/cards/leaders/Ryu";
import {Game} from "../../src/Game";
import {OrOptions} from "../../src/inputs/OrOptions";
import {SelectAmount} from "../../src/inputs/SelectAmount";
import {Player} from "../../src/Player";
import {Resources} from "../../src/Resources";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Ryu', function() {
  let card: Ryu; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Ryu();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.addProduction(Resources.STEEL, 1);
    player.addProduction(Resources.HEAT, 4);
    player.megaCredits = 8;
  });

  it('Cannot act', function() {
    [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT]
      .forEach((res) => player.addProduction(res, -5));

    expect(card.canAct(player)).is.false;
  })

  it('Takes action in Gen 1', function() {
    expect(card.canAct(player)).is.true;

    const selectProductionToDecrease = card.action(player) as OrOptions;
    // Can decrease M€, Steel or Heat prod
    expect(selectProductionToDecrease.options).has.length(3);

    // Select amount of M€ prod to lose - Gen 1
    let selectAmount = selectProductionToDecrease.options[0].cb() as SelectAmount;
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(1);
  });

  it('Takes action in Gen 4', function() {
    game.generation = 4;
    expect(card.canAct(player)).is.true;

    const selectProductionToDecrease = card.action(player) as OrOptions;
    // Can decrease M€, Steel or Heat prod
    expect(selectProductionToDecrease.options).has.length(3);

    // Select amount of M€ prod to lose - Gen 4
    let selectAmount = selectProductionToDecrease.options[0].cb() as SelectAmount;
    expect(selectAmount.max).eq(4);

    // Select amount of Steel prod to lose - Gen 4
    selectAmount = selectProductionToDecrease.options[1].cb() as SelectAmount;
    expect(selectAmount.max).eq(1);

    // Select amount of Heat prod to lose - Gen 4
    selectAmount = selectProductionToDecrease.options[2].cb() as SelectAmount;
    expect(selectAmount.max).eq(4);

    // Swap 4 Heat prod for Ti prod
    const selectProductionToIncrease = selectAmount.cb(4) as OrOptions;;
    expect(selectProductionToIncrease.options).has.length(5);
    selectProductionToIncrease.options[2].cb();
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.HEAT)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(4);
    expect(player.megaCredits).to.eq(0);
    expect(card.isDisabled).is.true;
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});

    TestingUtils.forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
