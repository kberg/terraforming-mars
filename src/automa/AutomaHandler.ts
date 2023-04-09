import {CardName} from "../CardName";
import {Game} from "../Game";
import {GameSetup} from "../GameSetup";
import {Player} from "../Player";
import {SpaceBonus} from "../SpaceBonus";
import {TileType} from "../TileType";
import {AresHandler} from "../ares/AresHandler";
import {BoardName} from "../boards/BoardName";
import {ISpace} from "../boards/ISpace";
import {Tags} from "../cards/Tags";
import {TerralabsResearch} from "../cards/turmoil/TerralabsResearch";
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, MILESTONE_VP, MIN_OXYGEN_LEVEL, MIN_TEMPERATURE, MIN_VENUS_SCALE, SOLO_START_TR} from "../constants";

const blockedOxygenSpots = [1, 3, 5, 7, 9, 11, 13];
const blockedTemperatureSpots = [-26, -24, -18, -14, -10, -6, -2, 2, 6];
const blockedVenusSpots = [2, 6, 10, 14, 18, 22, 26, 28];

export class AutomaHandler {
    private constructor() {}

    public static initialize(player: Player, game: Game): void {
      // Set the bot's starting TR and VP
      game.automaBotVictoryPointsBreakdown.terraformRating = SOLO_START_TR;
      if (game.gameOptions.preludeExtension) game.automaBotVictoryPointsBreakdown.terraformRating += 5;
      if (game.gameOptions.coloniesExtension) game.automaBotVictoryPointsBreakdown.terraformRating += 3;
      game.automaBotVictoryPointsBreakdown.updateTotal();

      // Set up the board
      this.placeInitialOcean(player, game);
      this.placeInitialGreenery(player, game);

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

    public static placeInitialGreenery(player: Player, game: Game): void {
      const neutral = GameSetup.neutralPlayerFor(game.id);

      if (game.gameOptions.shuffleMapOption) {
        this.placeGreeneryOnHighestLandPlacementValueSpot(player, game, neutral);
      } else {
        const targetSpace = this.getTargetGreenerySpace(game);

        if (targetSpace !== undefined && targetSpace.tile === undefined) {
          game.simpleAddTile(neutral, game.board.getSpace(targetSpace.id), {tileType: TileType.GREENERY});
        } else {
          this.placeGreeneryOnHighestLandPlacementValueSpot(player, game, neutral);
        }
      }
    }

    private static getTargetGreenerySpace(game: Game): ISpace | undefined {
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

    private static placeGreeneryOnHighestLandPlacementValueSpot(player: Player, game: Game, neutral: Player): void {
      const availableLandSpaces = game.board.getAvailableSpacesOnLand(player);
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
        return 1;
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
      switch (tag) {
      case Tags.SCIENCE:
      case Tags.ENERGY:
        game.automaBotVictoryPointsBreakdown.terraformRating++;

        if (game.getTemperature() === MAX_TEMPERATURE) {
          game.log('Bot revealed a ${0} tag and gained 1 TR as temperature is already maxed', (b) => b.string(tag));
          break;
        }

        AutomaHandler.increaseTemperature(game, 1);
        game.temperatureSilverCubeBonusMC = 0;
        this.checkForTemperatureBonusOcean(game);

        AresHandler.ifAres(game, (aresData) => {
          AresHandler.onTemperatureChange(game, aresData);
        });

        game.log('Bot revealed a ${0} tag and increased temperature 1 step', (b) => b.string(tag));
        break;
      case Tags.ANIMAL:
      case Tags.PLANT:
      case Tags.MICROBE:
        // TODO: Place a greenery tile and maybe raise oxygen
        break;
      case Tags.EARTH:
        // TODO: Place an ocean tile
        break;
      case Tags.SPACE:
      case Tags.CITY:
        // TODO: Place a City tile on Mars
        break;
      case Tags.BUILDING:
        game.automaBotVictoryPointsBreakdown.terraformRating++;
        game.log('Bot revealed a ${0} tag and gained 1 TR', (b) => b.string(tag));
        break;
      case Tags.EVENT:
      case Tags.JOVIAN:
      case Tags.WILDCARD:
        // TODO: Perform corporation action
        break;
      case Tags.VENUS:
        game.automaBotVictoryPointsBreakdown.terraformRating++;

        if (game.getVenusScaleLevel() === MAX_VENUS_SCALE) {
          game.log('Bot revealed a ${0} tag and gained 1 TR as Venus is already maxed', (b) => b.string(tag));
          break;
        }

        AutomaHandler.increaseVenusScale(game, 1);
        game.venusSilverCubeBonusMC = 0;
        const gotBonusTRFromVenusTrack = game.getVenusScaleLevel() === 16;
        if (gotBonusTRFromVenusTrack) game.automaBotVictoryPointsBreakdown.terraformRating++;

        // Check for Aphrodite corporation
        const aphrodite = game.getPlayers().find((player) => player.isCorporation(CardName.APHRODITE));
        if (aphrodite !== undefined) aphrodite.megaCredits += gotBonusTRFromVenusTrack ? 4 : 2;

        game.log('Bot revealed a ${0} tag and increased Venus scale 1 step', (b) => b.string(tag));
        break;
      case Tags.MOON:
        // TODO: Raise lowest Moon parameter? (TBC)
        break;
      default:
        break;
      }
    }

    private static checkForTemperatureBonusOcean(game: Game): void {
      if (game.getTemperature() === 0) {
        // TODO: Bot places an ocean tile
        game.oceansSilverCubeBonusMC = 0;
        game.automaBotVictoryPointsBreakdown.terraformRating++;
      }
    }
}