import {Game} from "../Game";
import {TerralabsResearch} from "../cards/turmoil/TerralabsResearch";
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, MIN_OXYGEN_LEVEL, MIN_TEMPERATURE, MIN_VENUS_SCALE, SOLO_START_TR} from "../constants";

const blockedOxygenSpots = [1, 3, 5, 7, 9, 11, 13];
const blockedTemperatureSpots = [-26, -24, -18, -14, -10, -6, -2, 2, 6];
const blockedVenusSpots = [2, 6, 10, 14, 18, 22, 26, 28];

export class AutomaHandler {
    private constructor() {}

    public static initialize(game: Game): void {
      game.automaBotVictoryPointsBreakdown.terraformRating = SOLO_START_TR;
      game.automaBotVictoryPointsBreakdown.victoryPoints = SOLO_START_TR;

      // This is just a placeholder for now, we'll add the real bot corporations later
      const automaBotCorporation = new TerralabsResearch();
      game.automaBotCorporation = automaBotCorporation;
      game.log('Bot played ${0}', (b) => b.card(automaBotCorporation));
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
}