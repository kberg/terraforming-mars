import {expect} from "chai";
import {Player} from "../src/Player";
import {Game, GameOptions} from "../src/Game";
import {TileType} from "../src/TileType";
import {ActionDetails, RedsPolicy} from "../src/turmoil/RedsPolicy";
import {TestPlayers} from "./TestPlayers";
import {TestingUtils} from "./TestingUtils";
import {IceAsteroid} from "../src/cards/base/IceAsteroid";
import {LavaFlows} from "../src/cards/base/LavaFlows";
import {ProtectedValley} from "../src/cards/base/ProtectedValley";
import {ArtificialLake} from "../src/cards/base/ArtificialLake";

describe("RedsPolicy", function () {
  let player : Player, player2 : Player, game : Game, iceAsteroid: ActionDetails, protectedValley: ActionDetails, lavaFlows: ActionDetails;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions() as GameOptions;
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    protectedValley = new ActionDetails({
      card: new ProtectedValley(),
      oxygenIncrease: 1,
      nonOceanToPlace: TileType.GREENERY,
      megaCreditsProduction: 2
    });

    iceAsteroid = new ActionDetails({
      card: new IceAsteroid(),
      oceansToPlace: 2,
      oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player),
    });

    lavaFlows = new ActionDetails({
      card: new LavaFlows(),
      temperatureIncrease: 2,
      nonOceanToPlace: TileType.LAVA_FLOWS,
      nonOceanAvailableSpaces: LavaFlows.getVolcanicSpaces(player)
    });
  });

  it("Should work", function() {
    // Playing Protected Valley costs 23 + 3 = 26
    // Playing Ice Asteroid costs 23 + 3*2 = 29

    player.megaCredits = 23;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.false;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.false;

    player.megaCredits = 26;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.true;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.false;

    player.megaCredits = 29;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, protectedValley, true).canAfford).is.true;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true).canAfford).is.true;
  });

  it("Should work with placement bonus", function() {
    player.megaCredits = 27;

    // Can gain 2 MC from placing the 2nd ocean next to the first one
    const test = RedsPolicy.canAffordRedsPolicy(player, game, iceAsteroid, false, true);
    expect(test.canAfford).is.true;
    expect(test.spaces!.size).to.be.gte(1);
  });

  it("Should work with Lava Flows", function() {
    player.megaCredits = 22;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.false;

    player.megaCredits = 25;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows).canAfford).is.true;

    player.megaCredits = 25;
    (game as any).temperature = -2;
    const test3 = RedsPolicy.canAffordRedsPolicy(player, game, lavaFlows); // 18 + 3*3
    // We only have 25 M€ but can place on Tharsis Tholus to get 2 M€ from ocean adjacency
    expect(test3.canAfford).is.true;

    const spaces = test3.spaces!;
    const ocean04 = game.board.getSpace("04");
    const tharsisTholus = game.board.getSpace("09");
    expect(spaces).has.lengthOf(1);
    expect(spaces.has(ocean04)).is.true;
    expect(spaces.get(ocean04) as any).has.lengthOf(1);
    expect((spaces.get(ocean04) as any).has(tharsisTholus)).is.true;
  });

  it("Should work with Artificial Lake", function() {
    const artificialLake = new ActionDetails({
      card: new ArtificialLake(),
      oceansToPlace: 1,
      nonOceanToPlace: TileType.OCEAN,
      nonOceanAvailableSpaces: player.game.board.getAvailableSpacesOnLand(player)
    });

    player.megaCredits = 17;
    expect(RedsPolicy.canAffordRedsPolicy(player, game, artificialLake).canAfford).is.false;

    player.megaCredits = 18; // 15 + 3
    expect(RedsPolicy.canAffordRedsPolicy(player, game, artificialLake).canAfford).is.true;

    player.megaCredits = 17;
    game.addOceanTile(player, "04");
    TestingUtils.runAllActions(game);

    const howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, artificialLake);
    expect(howToAffordReds.canAfford).is.true;

    const spaces = howToAffordReds.spaces!;
    // Must place Artificial Lake ocean on 1 of the 4 spots next to existing ocean to afford Reds
    expect(spaces).has.lengthOf(4);
    const tharsisTholus = game.board.getSpace("09");
    expect(spaces.has(tharsisTholus)).is.true;
  });
});