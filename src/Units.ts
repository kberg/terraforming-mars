// A representation of a value associated with each standard resource type.
// Could be a player's inventory, or their production, or just a way to pass several resource-related values

import {Player} from './Player';

// across the game.
export interface Units {
  megacredits: number;
  steel: number;
  titanium: number;
  plants: number;
  energy: number;
  heat: number;
}

export interface PartialUnits {
  megacredits?: number;
  steel?: number;
  titanium?: number;
  plants?: number;
  energy?: number;
  heat?: number;
}

export namespace Units {
  export interface Options {
    dueTo?: Player;
    globalEvent?: boolean;
    log?: boolean;
  };

  export function of(partialUnits: PartialUnits): Units {
    return {
      megacredits: partialUnits.megacredits === undefined ? 0 : partialUnits.megacredits,
      steel: partialUnits.steel === undefined ? 0 : partialUnits.steel,
      titanium: partialUnits.titanium === undefined ? 0 : partialUnits.titanium,
      plants: partialUnits.plants === undefined ? 0 : partialUnits.plants,
      energy: partialUnits.energy === undefined ? 0 : partialUnits.energy,
      heat: partialUnits.heat === undefined ? 0 : partialUnits.heat,
    };
  }
  export const EMPTY: Units = Units.of({});

  export function adjustUnits(delta: PartialUnits, player: Player, purse: Units) {
    if (!player.hasUnits(delta)) {
      throw new Error();
    }
    purse.megacredits += delta.megacredits || 0;
    purse.steel += delta.steel || 0;
    purse.titanium += delta.titanium || 0;
    purse.plants += delta.plants || 0;
    purse.energy += delta.energy || 0;
    purse.heat += delta.heat || 0;
  }

  export function hasProduction(units: Units | PartialUnits, player: Player): boolean {
    return player.megaCreditProduction - (units.megacredits || 0) >= -5 &&
      player.steelProduction - (units.steel || 0) >= 0 &&
      player.titaniumProduction - (units.titanium || 0) >= 0 &&
      player.plantProduction - (units.plants || 0) >= 0 &&
      player.energyProduction - (units.energy || 0) >= 0 &&
      player.heatProduction - (units.heat || 0) >= 0;
  }
}
