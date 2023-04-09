import {CardName} from "../CardName";
import {Game} from "../Game";
import {GameSetup} from "../GameSetup";
import {LogHelper} from "../LogHelper";
import {Player} from "../Player";
import {SerializedVictoryPointsBreakdown} from "../SerializedVictoryPointsBreakdown";
import {SpaceBonus} from "../SpaceBonus";
import {SpaceType} from "../SpaceType";
import {TileType} from "../TileType";
import {VictoryPointsBreakdown} from "../VictoryPointsBreakdown";
import {AresHandler} from "../ares/AresHandler";
import {_AresHazardPlacement} from "../ares/AresHazards";
import {Board} from "../boards/Board";
import {BoardName} from "../boards/BoardName";
import {BoardType} from "../boards/BoardType";
import {ISpace} from "../boards/ISpace";
import {Tags} from "../cards/Tags";
import {TerralabsResearch} from "../cards/turmoil/TerralabsResearch";
import {MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, MILESTONE_VP, MIN_OXYGEN_LEVEL, MIN_TEMPERATURE, MIN_VENUS_SCALE, SOLO_START_TR} from "../constants";

const blockedOxygenSpots = [1, 3, 5, 7, 9, 11, 13];
const blockedTemperatureSpots = [-26, -24, -18, -14, -10, -6, -2, 2, 6];
const blockedVenusSpots = [2, 6, 10, 14, 18, 22, 26, 28];

export class AutomaHandler {
    private constructor() {}

    public static initialize(player: Player, game: Game): void {
      // Set the bot's starting TR and VP
      game.automaBotVictoryPointsBreakdown.terraformRating = SOLO_START_TR;
      // Starting neutral greeneries and cities
      game.automaBotVictoryPointsBreakdown.greenery = 2;
      game.automaBotVictoryPointsBreakdown.city = 2;
      // Expansion modifiers
      if (game.gameOptions.preludeExtension) game.automaBotVictoryPointsBreakdown.terraformRating += 5;
      if (game.gameOptions.coloniesExtension) game.automaBotVictoryPointsBreakdown.terraformRating += 3;
      game.automaBotVictoryPointsBreakdown.updateTotal();

      // Set up the board
      this.placeInitialOcean(player, game);
      this.placeInitialGreenery(game);

      // This is just a placeholder for now, we'll add the real bot corporations later
      const automaBotCorporation = new TerralabsResearch();
      game.automaBotCorporation = automaBotCorporation;
      game.log('Bot played ${0}', (b) => b.card(automaBotCorporation));
    }

    public static placeInitialOcean(player: Player, game: Game): void {
      const neutral = GameSetup.neutralPlayerFor(game.id);

      if (game.gameOptions.shuffleMapOption) {
        const availableOceanSpaces = game.board.getAvailableSpacesForOcean(player);
        const oceanPlacementValues = availableOceanSpaces.map((s) => this.computePlacementValue(s));
        const highestOceanPlacementValue = Math.max(...oceanPlacementValues);

        const index = oceanPlacementValues.indexOf(highestOceanPlacementValue);
        game.simpleAddTile(neutral, availableOceanSpaces[index], {tileType: TileType.OCEAN});
      } else {
        switch (game.gameOptions.boardName) {
        case BoardName.ORIGINAL:
          // 2 card spot
          game.simpleAddTile(neutral, game.board.getSpace('13'), {tileType: TileType.OCEAN});
          break;
        case BoardName.HELLAS:
          // Upper 2 plant spot
          game.simpleAddTile(neutral, game.board.getSpace('03'), {tileType: TileType.OCEAN});
          break;
        case BoardName.ELYSIUM:
          // Lower 2 plant spot
          game.simpleAddTile(neutral, game.board.getSpace('32'), {tileType: TileType.OCEAN});
          break;
        case BoardName.AMAZONIS:
          // 2 card spot
          game.simpleAddTile(neutral, game.board.getSpace('12'), {tileType: TileType.OCEAN});
          break;
        case BoardName.ARABIA_TERRA:
          // 2 card spot
          game.simpleAddTile(neutral, game.board.getSpace('07'), {tileType: TileType.OCEAN});
          break;
        case BoardName.TERRA_CIMMERIA:
          // Bottom middle 2 plant spot
          game.simpleAddTile(neutral, game.board.getSpace('61'), {tileType: TileType.OCEAN});
          break;
        case BoardName.VASTITAS_BOREALIS:
          // Plant + card spot
          game.simpleAddTile(neutral, game.board.getSpace('19'), {tileType: TileType.OCEAN});
          break;
        }
      }
    }

    public static placeInitialGreenery(game: Game): void {
      const neutral = GameSetup.neutralPlayerFor(game.id);

      if (game.gameOptions.shuffleMapOption) {
        this.placeGreeneryOnHighestLandPlacementValueSpot(game, neutral);
      } else {
        const targetSpace = this.getTargetInitialGreenerySpace(game);

        if (targetSpace !== undefined && targetSpace.tile === undefined) {
          game.simpleAddTile(neutral, game.board.getSpace(targetSpace.id), {tileType: TileType.GREENERY});
        } else {
          this.placeGreeneryOnHighestLandPlacementValueSpot(game, neutral);
        }
      }
    }

    private static getTargetInitialGreenerySpace(game: Game): ISpace | undefined {
      switch (game.gameOptions.boardName) {
      case BoardName.ORIGINAL:
        return undefined;
      case BoardName.HELLAS:
        // South pole spot
        return game.board.getSpace('61');
      case BoardName.ELYSIUM:
        // 3 card spot
        return game.board.getSpace('20');
      case BoardName.AMAZONIS:
        // 3 plant spot
        return game.board.getSpace('05');
      case BoardName.ARABIA_TERRA:
        // Lower 2 plant spot
        return game.board.getSpace('48');
      case BoardName.TERRA_CIMMERIA:
        // 2 card spot
        return game.board.getSpace('38');
      case BoardName.VASTITAS_BOREALIS:
        // Temperature spot
        return game.board.getSpace('33');
      }
    }

    private static placeGreeneryOnHighestLandPlacementValueSpot(game: Game, neutral: Player): void {
      const availableLandSpaces = game.board.getAvailableSpacesOnLand(neutral);
      const landPlacementValues = availableLandSpaces.map((s) => this.computePlacementValue(s));
      const highestLandPlacementValue = Math.max(...landPlacementValues);

      const index = landPlacementValues.indexOf(highestLandPlacementValue);
      game.simpleAddTile(neutral, availableLandSpaces[index], {tileType: TileType.GREENERY});
    }

    private static computePlacementValue(space: ISpace): number {
      return space.bonus.reduce((acc, val) => acc + this.getSpaceBonusValue(val), 0);
    }

    // These values are approximations just to ensure that we can always identify
    // the most valuable tile placement spots, even with randomized board tiles
    private static getSpaceBonusValue(spaceBonus: SpaceBonus): number {
      switch (spaceBonus) {
      case SpaceBonus.TITANIUM:
        return 3;
      case SpaceBonus.STEEL:
        return 2;
      case SpaceBonus.PLANT:
        return 2.2;
      case SpaceBonus.DRAW_CARD:
        return 4;
      case SpaceBonus.HEAT:
        return 1.2;
      case SpaceBonus.TEMPERATURE:
        return 7.5;
      case SpaceBonus.OCEAN:
        return 8;
      case SpaceBonus.ANIMAL:
        return 3.5;
      case SpaceBonus.MICROBE:
        return 3.3;
      case SpaceBonus.POWER:
        return 1.5;
      case SpaceBonus.MEGACREDITS:
        return 1;
      case SpaceBonus.MICROBE:
        return 2.5;
      default:
        return 0;
      }
    }

    public static decreaseTemperature(game: Game, steps: number): void {
      if (game.gameOptions.automaSoloVariant) {
        for (let i = 0; i < Math.abs(steps); i++) {
          game.setTemperature(game.getTemperature() - 2);

          while (blockedTemperatureSpots.includes(game.getTemperature()) && game.getTemperature() > MIN_TEMPERATURE) {
            game.setTemperature(game.getTemperature() - 2);
          }
        }
      } else {
        game.setTemperature(Math.max(MIN_TEMPERATURE, game.getTemperature() + steps * 2));
      }
    }

    public static increaseTemperature(game: Game, steps: number): void {
      if (game.gameOptions.automaSoloVariant) {
        for (let i = 0; i < steps; i++) {
          game.setTemperature(game.getTemperature() + 2);

          while (blockedTemperatureSpots.includes(game.getTemperature()) && game.getTemperature() < MAX_TEMPERATURE) {
            game.setTemperature(game.getTemperature() + 2);
          }
        }
      } else {
        game.setTemperature(game.getTemperature() + steps * 2);
      }
    }

    public static decreaseVenusScale(game: Game, steps: number): void {
      if (game.gameOptions.automaSoloVariant) {
        for (let i = 0; i < Math.abs(steps); i++) {
          game.setVenusScaleLevel(game.getVenusScaleLevel() - 2);

          while (blockedVenusSpots.includes(game.getVenusScaleLevel()) && game.getVenusScaleLevel() > MIN_VENUS_SCALE) {
            game.setVenusScaleLevel(game.getVenusScaleLevel() - 2);
          }
        }
      } else {
        game.setVenusScaleLevel(Math.max(MIN_VENUS_SCALE, game.getVenusScaleLevel() + steps * 2));
      }
    }

    public static increaseVenusScale(game: Game, steps: number): void {
      if (game.gameOptions.automaSoloVariant) {
        for (let i = 0; i < steps; i++) {
          game.setVenusScaleLevel(game.getVenusScaleLevel() + 2);

          while (blockedVenusSpots.includes(game.getVenusScaleLevel()) && game.getVenusScaleLevel() < MAX_VENUS_SCALE) {
            game.setVenusScaleLevel(game.getVenusScaleLevel() + 2);
          }
        }
      } else {
        game.setVenusScaleLevel(game.getVenusScaleLevel() + steps * 2);
      }
    }

    public static decreaseOxygenLevel(game: Game, steps: number): void {
      if (game.gameOptions.automaSoloVariant) {
        for (let i = 0; i < Math.abs(steps); i++) {
          game.setOxygenLevel(game.getOxygenLevel() - 1);

          while (blockedOxygenSpots.includes(game.getOxygenLevel()) && game.getOxygenLevel() > MIN_OXYGEN_LEVEL) {
            game.setOxygenLevel(game.getOxygenLevel() - 1);
          }
        }
      } else {
        game.setOxygenLevel(Math.max(MIN_OXYGEN_LEVEL, game.getOxygenLevel() + steps));
      }
    }

    public static increaseOxygenLevel(game: Game, steps: number): void {
      if (game.gameOptions.automaSoloVariant) {
        for (let i = 0; i < steps; i++) {
          game.setOxygenLevel(game.getOxygenLevel() + 1);

          while (blockedOxygenSpots.includes(game.getOxygenLevel()) && game.getOxygenLevel() < MAX_OXYGEN_LEVEL) {
            game.setOxygenLevel(game.getOxygenLevel() + 1);
          }
        }
      } else {
        game.setOxygenLevel(game.getOxygenLevel() + steps);
      }
    }

    public static scoreUnclaimedMilestones(game: Game): void {
      const allMilestones = game.milestones;
      const allClaimedMilestones = game.claimedMilestones.map((cm) => cm.milestone);
      const unclaimedMilestones = allMilestones.filter((m) => allClaimedMilestones.map((cm) => cm.name).includes(m.name) === false);

      unclaimedMilestones.forEach((milestone) => {
        game.log('Bot claimed ${0} milestone', (b) => b.milestone(milestone));
        game.automaBotVictoryPointsBreakdown.milestones += MILESTONE_VP;
      });

      game.automaBotVictoryPointsBreakdown.updateTotal();
    }

    public static takeBotTurn(game: Game): void {
      const botActionsCount = Math.ceil(game.generation / 2);
      let actionsTaken = 0;

      while (actionsTaken < botActionsCount) {
        const topCard = game.dealer.dealCard(game);
        game.log('Bot revealed and discarded ${0}', (b) => b.card(topCard));
        game.dealer.discard(topCard);

        for (let i = 0; i < topCard.tags.length; i++) {
          this.performActionForTag(game, topCard.tags[i]);
          actionsTaken++;
        }
      }
    }

    public static performActionForTag(game: Game, tag: Tags): void {
      const neutral = GameSetup.neutralPlayerFor(game.id);

      switch (tag) {
      case Tags.SCIENCE:
      case Tags.ENERGY:
        game.automaBotVictoryPointsBreakdown.terraformRating++;

        if (game.getTemperature() === MAX_TEMPERATURE) {
          game.log('Bot action from ${0} tag: Gain 1 TR as temperature is already maxed', (b) => b.string(tag));
          break;
        }

        AutomaHandler.increaseTemperature(game, 1);
        game.temperatureSilverCubeBonusMC = 0;
        this.checkForTemperatureBonusOcean(game, neutral);

        AresHandler.ifAres(game, (aresData) => {
          AresHandler.onTemperatureChange(game, aresData);
        });

        game.log('Bot action from ${0} tag: Increase temperature 1 step', (b) => b.string(tag));
        break;
      case Tags.ANIMAL:
      case Tags.PLANT:
      case Tags.MICROBE:
        const landSpacesCount = game.board.getAvailableSpacesOnLand(neutral).length;
        if (landSpacesCount === 0) {
          game.automaBotVictoryPointsBreakdown.terraformRating++;
          game.log('Bot action from ${0} tag: Gain 1 TR as there are no greenery spots left', (b) => b.string(tag));
          break;
        }

        game.automaBotVictoryPointsBreakdown.greenery++;

        if (game.getOxygenLevel() !== MAX_OXYGEN_LEVEL) {
          AutomaHandler.increaseOxygenLevel(game, 1);
          game.automaBotVictoryPointsBreakdown.terraformRating++;

          if (game.getOxygenLevel() === 8 && game.getTemperature() !== MAX_TEMPERATURE) {
            AutomaHandler.increaseTemperature(game, 1);
            game.temperatureSilverCubeBonusMC = 0;
            game.automaBotVictoryPointsBreakdown.terraformRating++;
            this.checkForTemperatureBonusOcean(game, neutral);

            AresHandler.ifAres(game, (aresData) => {
              AresHandler.onTemperatureChange(game, aresData);
            });
          }
        }

        const targetGreenerySpace = AutomaHandler.getTargetGreenerySpace(game, neutral);
        game.simpleAddTile(neutral, game.board.getSpace(targetGreenerySpace.id), {tileType: TileType.GREENERY});
        AutomaHandler.grantBonusesForBotTilePlacement(game, targetGreenerySpace, neutral);
        game.oxygenSilverCubeBonusMC = 0;
        game.log('Bot action from ${0} tag: Place a greenery on row ${1} position ${2}', (b) => b.string(tag).number(targetGreenerySpace.y + 1).number(targetGreenerySpace.x - Math.abs(targetGreenerySpace.y - 4) + 1));

        // Each adjacent bot city scores 1 VP for the newly placed greenery
        const adjacentCities = game.board.getAdjacentSpaces(targetGreenerySpace).filter((space) => space.spaceType === SpaceType.LAND && space.tile?.tileType === TileType.CITY && space.player?.name === neutral.name);
        game.automaBotVictoryPointsBreakdown.city += adjacentCities.length;

        break;
      case Tags.EARTH:
        game.automaBotVictoryPointsBreakdown.terraformRating++;

        if (game.board.getOceansOnBoard(game.gameOptions.automaSoloVariant) === MAX_OCEAN_TILES) {
          game.log('Bot action from ${0} tag: Gain 1 TR as oceans are already maxed', (b) => b.string(tag));
          break;
        }

        const targetOceanSpace: ISpace = this.getTargetOceanSpace(game);
        game.simpleAddTile(neutral, game.board.getSpace(targetOceanSpace.id), {tileType: TileType.OCEAN});
        AutomaHandler.grantBonusesForBotTilePlacement(game, targetOceanSpace, neutral);
        game.oceansSilverCubeBonusMC = 0;
        game.log('Bot action from ${0} tag: Place an ocean on row ${1} position ${2}', (b) => b.string(tag).number(targetOceanSpace.y + 1).number(targetOceanSpace.x - Math.abs(targetOceanSpace.y - 4) + 1));

        this.maybeRemoveAresDustStorms(game);
        this.maybePlaceErosions(game);
        break;
      case Tags.SPACE:
      case Tags.CITY:
        const availableCitySpaces = game.board.getAvailableSpacesForCity(game.getPlayers()[0]);

        if (availableCitySpaces.length === 0) {
          game.automaBotVictoryPointsBreakdown.terraformRating++;
          game.log('Bot action from ${0} tag: Gain 1 TR as there are no city spots left', (b) => b.string(tag));
          break;
        }

        const targetCitySpace: ISpace = this.getTargetCitySpace(game);
        game.simpleAddTile(neutral, game.board.getSpace(targetCitySpace.id), {tileType: TileType.CITY});
        AutomaHandler.grantBonusesForBotTilePlacement(game, targetCitySpace, neutral);

        const adjacentGreeneries = game.board.getAdjacentSpaces(targetCitySpace).filter((s) => s.tile?.tileType === TileType.GREENERY).length;
        game.automaBotVictoryPointsBreakdown.city += adjacentGreeneries;
        game.log('Bot action from ${0} tag: Place a city on row ${1} position ${2}', (b) => b.string(tag).number(targetCitySpace.y + 1).number(targetCitySpace.x - Math.abs(targetCitySpace.y - 4) + 1));
        break;
      case Tags.BUILDING:
        game.automaBotVictoryPointsBreakdown.terraformRating++;
        game.log('Bot action from ${0} tag: Gain 1 TR', (b) => b.string(tag));
        break;
      case Tags.EVENT:
      case Tags.JOVIAN:
      case Tags.WILDCARD:
        // TODO: Perform corporation action
        break;
      case Tags.VENUS:
        game.automaBotVictoryPointsBreakdown.terraformRating++;

        if (game.getVenusScaleLevel() === MAX_VENUS_SCALE) {
          game.log('Bot action from ${0} tag: Gain 1 TR as Venus is already maxed', (b) => b.string(tag));
          break;
        }

        AutomaHandler.increaseVenusScale(game, 1);
        game.venusSilverCubeBonusMC = 0;
        const gotBonusTRFromVenusTrack = game.getVenusScaleLevel() === 16;
        if (gotBonusTRFromVenusTrack) game.automaBotVictoryPointsBreakdown.terraformRating++;

        // Check for Aphrodite corporation
        const aphrodite = game.getPlayers().find((player) => player.isCorporation(CardName.APHRODITE));
        if (aphrodite !== undefined) aphrodite.megaCredits += gotBonusTRFromVenusTrack ? 4 : 2;

        game.log('Bot action from ${0} tag: Increase Venus scale 1 step', (b) => b.string(tag));
        break;
      case Tags.MOON:
        // TODO: Raise lowest Moon parameter? (TBC)
        break;
      default:
        break;
      }

      game.automaBotVictoryPointsBreakdown.updateTotal();
    }

    // Rule 1: Highest placement value
    // Rule 2: Adjacent to most other oceans
    private static getTargetOceanSpace(game: Game): ISpace {
      const soloPlayer = game.getPlayers()[0];
      const availableOceanSpaces = game.board.getAvailableSpacesForOcean(soloPlayer);
      const oceanPlacementValues = availableOceanSpaces.map((s) => this.computePlacementValue(s));
      const highestOceanPlacementValue = Math.max(...oceanPlacementValues);
      const highestValueSpaces = oceanPlacementValues.filter((v) => v === highestOceanPlacementValue);

      if (highestValueSpaces.length === 1) {
        const index = oceanPlacementValues.indexOf(highestOceanPlacementValue);
        return availableOceanSpaces[index];
      } else {
        const tiedSpaces = availableOceanSpaces.filter((space) => this.computePlacementValue(space) === highestOceanPlacementValue);
        const adjacentOceansCount = tiedSpaces.map((space) => game.board.getAdjacentSpaces(space).filter((s) => Board.isOceanSpace(s)).length);

        return tiedSpaces.find((space) => game.board.getAdjacentSpaces(space).filter((s) => Board.isOceanSpace(s)).length === Math.max(...adjacentOceansCount))!;
      }
    }

    // Rule 1: Adjacent to most greeneries
    // Rule 2: Most spots for future greeneries
    // Rule 3: Most spots for future greeneries adjacent to oceans or reserved areas for oceans
    private static getTargetCitySpace(game: Game): ISpace {
      const soloPlayer = game.getPlayers()[0];
      let availableCitySpaces: ISpace[] = game.board.getAvailableSpacesForCity(soloPlayer);

      const adjacentGreeneriesCounts: number[] = availableCitySpaces.map((s) => game.board.getAdjacentSpaces(s).filter((s) => s.tile?.tileType === TileType.GREENERY).length);
      const highestAdjacentGreeneriesCount: number = Math.max(...adjacentGreeneriesCounts);

      availableCitySpaces = availableCitySpaces.filter((s) => game.board.getAdjacentSpaces(s).filter((s) => s.tile?.tileType === TileType.GREENERY).length === highestAdjacentGreeneriesCount);

      if (availableCitySpaces.length === 1) {
        return availableCitySpaces[0];
      } else {
        const futureGreenerySpotsCounts: number[] = availableCitySpaces.map((space) => game.board.getAdjacentSpaces(space).filter((s) => s.tile === undefined && s.player === undefined && s.spaceType === SpaceType.LAND).length);
        const highestFutureGreenerySpotsCount: number = Math.max(...futureGreenerySpotsCounts);

        availableCitySpaces = availableCitySpaces.filter((space) => game.board.getAdjacentSpaces(space).filter((s) => s.tile === undefined && s.player === undefined && s.spaceType === SpaceType.LAND).length === highestFutureGreenerySpotsCount);

        if (availableCitySpaces.length === 1) {
          return availableCitySpaces[0];
        } else {
          const futureGreenerySpotsAdjacentToOceansCounts: number[] = availableCitySpaces.map((space) => game.board.getAdjacentSpaces(space).filter((s) => game.board.getAdjacentSpaces(s).some((adjSpace) => adjSpace.spaceType === SpaceType.OCEAN)).length);
          const highestFutureGreenerySpotsAdjacentToOceansCount: number = Math.max(...futureGreenerySpotsAdjacentToOceansCounts);

          availableCitySpaces = availableCitySpaces.filter((space) => game.board.getAdjacentSpaces(space).filter((s) => game.board.getAdjacentSpaces(s).some((adjSpace) => adjSpace.spaceType === SpaceType.OCEAN)).length === highestFutureGreenerySpotsAdjacentToOceansCount);
          return availableCitySpaces[0];
        }
      }
    }

    public static scoreCityVPForPlayerGreeneryPlacements(game: Game, space: ISpace): void {
      const neutral = GameSetup.neutralPlayerFor(game.id);
      game.automaBotVictoryPointsBreakdown.city += game.board.getAdjacentSpaces(space).filter((s) => s.tile?.tileType === TileType.CITY && s.player?.name === neutral.name).length;
    }

    // Rule 1: Adjacent to most own cities
    // Rule 2: Adjacent to fewest opponent cities
    // Rule 3: Highest placement bonus
    private static getTargetGreenerySpace(game: Game, neutral: Player): ISpace {
      let availableGreenerySpaces: ISpace[] = game.board.getAvailableSpacesOnLand(neutral).filter((space) => game.board.getAdjacentSpaces(space).some((adjSpace) => adjSpace.tile?.tileType === TileType.CITY && adjSpace.player?.name === neutral.name));

      const adjacentCitiesCounts: number[] = availableGreenerySpaces.map((s) => game.board.getAdjacentSpaces(s).filter((adjSpace) => adjSpace.tile?.tileType === TileType.CITY && adjSpace.player?.name === neutral.name && adjSpace.spaceType === SpaceType.LAND).length);
      const highestAdjacentCitiesCounts: number = Math.max(...adjacentCitiesCounts);
      availableGreenerySpaces = availableGreenerySpaces.filter((s) => game.board.getAdjacentSpaces(s).filter((adjSpace) => adjSpace.tile?.tileType === TileType.CITY && adjSpace.player?.name === neutral.name).length === highestAdjacentCitiesCounts);

      if (availableGreenerySpaces.length === 1) {
        return availableGreenerySpaces[0];
      } else {
        const adjacentToOpponentCitiesCounts: number[] = availableGreenerySpaces.map((space) => game.board.getAdjacentSpaces(space).filter((adjSpace) => adjSpace.tile?.tileType === TileType.CITY && adjSpace.player !== undefined && adjSpace.player?.name !== neutral.name).length);
        const lowestAdjacentToOpponentCitiesCount: number = Math.min(...adjacentToOpponentCitiesCounts);

        availableGreenerySpaces = availableGreenerySpaces.filter((space) => game.board.getAdjacentSpaces(space).filter((adjSpace) => adjSpace.tile?.tileType === TileType.CITY && adjSpace.player !== undefined && adjSpace.player.name !== neutral.name).length === lowestAdjacentToOpponentCitiesCount);

        if (availableGreenerySpaces.length === 1) {
          return availableGreenerySpaces[0];
        } else {
          const greeneryPlacementValues = availableGreenerySpaces.map((s) => this.computePlacementValue(s));
          const highestGreeneryPlacementValue = Math.max(...greeneryPlacementValues);
          const index = greeneryPlacementValues.indexOf(highestGreeneryPlacementValue);

          return availableGreenerySpaces[index];
        }
      }
    }

    private static checkForTemperatureBonusOcean(game: Game, neutral: Player): void {
      if (game.getTemperature() === 0) {
        const targetSpace: ISpace = this.getTargetOceanSpace(game);
        game.simpleAddTile(neutral, game.board.getSpace(targetSpace.id), {tileType: TileType.OCEAN});

        game.oceansSilverCubeBonusMC = 0;
        game.automaBotVictoryPointsBreakdown.terraformRating++;
        AutomaHandler.grantBonusesForBotTilePlacement(game, targetSpace, neutral);
      }
    }

    private static grantBonusesForBotTilePlacement(game: Game, space: ISpace, neutral: Player) : void {
      game.getPlayers().forEach((p) => {
        p.corporationCards.forEach((corp) => {
          corp.onTilePlaced?.(p, neutral, space, BoardType.MARS);
        });

        p.playedCards.forEach((playedCard) => {
          playedCard.onTilePlaced?.(p, neutral, space, BoardType.MARS);
        });
      });
    }

    private static maybeRemoveAresDustStorms(game: Game): void {
      AresHandler.ifAres(game, (aresData) => {
        _AresHazardPlacement.testConstraint(
          aresData.hazardData.removeDustStormsOceanCount,
          game.board.getOceansOnBoard(game.gameOptions.automaSoloVariant),
          () => {
            game.board.spaces.forEach((space) => {
              if (space.tile?.tileType === TileType.DUST_STORM_MILD || space.tile?.tileType === TileType.DUST_STORM_SEVERE) {
                if (space.tile.protectedHazard !== true) space.tile = undefined;
              }
            });

            game.log('Bot eliminated dust storms.');
          },
        );
      });
    }

    private static maybePlaceErosions(game: Game): void {
      const neutral = GameSetup.neutralPlayerFor(game.id);

      AresHandler.ifAres(game, (aresData) => {
        _AresHazardPlacement.testConstraint(
          aresData.hazardData.erosionOceanCount,
          game.board.getOceansOnBoard(game.gameOptions.automaSoloVariant),
          () => {
            let type = TileType.EROSION_MILD;
            if (aresData.hazardData.severeErosionTemperature.available !== true) {
              type = TileType.EROSION_SEVERE;
            }

            const space1 = _AresHazardPlacement.randomlyPlaceHazard(game, type, 1);
            const space2 = _AresHazardPlacement.randomlyPlaceHazard(game, type, -1);

            [space1, space2].forEach((space) => {
              LogHelper.logTilePlacement(neutral, space, type);
            });
          },
        );
      });
    }

    public static deserializeBotVictoryPoints(d: SerializedVictoryPointsBreakdown): VictoryPointsBreakdown {
      const vpb = new VictoryPointsBreakdown();
      vpb.terraformRating = d.terraformRating;
      vpb.milestones = d.milestones;
      vpb.awards = d.awards;
      vpb.greenery = d.greenery;
      vpb.city = d.city;
      vpb.moonColonies = d.moonColonies;
      vpb.moonMines = d.moonMines;
      vpb.moonRoads = d.moonRoads;
      vpb.victoryPoints = d.victoryPoints;
      vpb.total = d.total;

      return vpb;
    }

    public static serializeBotVictoryPoints(vpb: VictoryPointsBreakdown): SerializedVictoryPointsBreakdown {
      return {
        total: vpb.total,
        terraformRating: vpb.terraformRating,
        milestones: vpb.milestones,
        awards: vpb.awards,
        greenery: vpb.greenery,
        city: vpb.city,
        moonColonies: vpb.moonColonies,
        moonMines: vpb.moonMines,
        moonRoads: vpb.moonRoads,
        victoryPoints: vpb.victoryPoints,
      };
    }
}