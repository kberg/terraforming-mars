import {CardName} from "../CardName";
import {Game} from "../Game";
import {IProjectCard} from "../cards/IProjectCard";
import {Player} from "../Player";
import {ResourceType} from "../ResourceType";
import {SpaceBonus} from "../SpaceBonus";
import {SpaceName} from "../SpaceName";
import {StandardProjectType} from "../StandardProjectType";
import {Tags} from "../cards/Tags";
import {TileType} from "../TileType";
import {HELLAS_BONUS_OCEAN_COST, MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from "../constants";
import {Board} from "../boards/Board";
import {ISpace} from "../boards/ISpace";
import {BoardName} from "../boards/BoardName";

/*
 * TODO: Most of the members of that class could be inferred from card metadata once it's usable
 * Constructor is expecting an object with properties from the class and will defaults the others
 * Usage: new ActionDetails({card: new LavaFlows(), temperatureIncrease: 2, nonOceanToPlace: TileType.LAVA_FLOWS, nonOceanAvailableSpaces: LavaFlows.getVolcanicSpaces(player, game)});
 */
export class ActionDetails {
  public card?: IProjectCard;
  public standardProject?: StandardProjectType;
  public isPlantsConversion: boolean = false;
  public cost: number = 0; // Cost of the action in M€
  public TRIncrease: number = 0; // If action increases TR
  public oxygenIncrease: number = 0; // If action increases oxygen
  public temperatureIncrease: number = 0; // If action increases temperature
  public venusIncrease: number = 0; // If action increases Venus scale
  public oceansToPlace: number = 0; // If action places an ocean tile
  public oceansAvailableSpaces: Array<ISpace> = []; // Default spaces where the ocean tile can be placed
  public nonOceanToPlace?: TileType; // If action places a non ocean tile (City, Greenery, Special, etc)
  public nonOceanAvailableSpaces: Array<ISpace> = []; // Default spaces where non ocean tile can be placed
  public animals: number = 0; // If action adds animals to a card
  public microbes: number = 0; // If action adds microbes to a card
  public megaCreditsProduction: number = 0; // If action increases M€ production - for Manutech
  public reservedHeat: number = 0; // If action requires heat - for Helion

  constructor(action: Partial<ActionDetails>) {
    Object.assign(this, action);
  }
}

type ISpaceTree = Map<ISpace, ISpaceBranch>;
type ISpaceBranch = ISpaceTree | undefined;

export interface HowToAffordRedsPolicy {
  // true if the player can afford everything, false if not
  canAfford: boolean,
  // if set, how much the player can spend on the card/action itself in M€
  mustSpendAtMost?: number,
  // A tree limiting available spaces for tile placements, if needed
  spaces?: ISpaceTree
  // Number of oceans to be placed (for computing reserved M€ correctly in case of Lakefront)
  oceansToPlace?: number
}

export class RedsPolicy {  
  /*
   * Check if the player will be able to afford all Reds taxes after playing the card
   * by checking every possible tile placement, etc
   *
   * Returns true if the card is playable no matter what
   * Returns false if the card is not playable
   * Otherwise, returns an array of ISpace where tiles must be placed in order to afford the taxes
   */
  public static canAffordRedsPolicy(
    player: Player,
    game: Game,
    action: ActionDetails,
    canUseSteel: boolean = false,
    canUseTitanium: boolean = false,
    canUseFloaters: boolean = false,
    canUseMicrobes: boolean = false
  ): HowToAffordRedsPolicy {
    // If oxygen increase will increase temperature
    if (game.getOxygenLevel() < 8 && game.getOxygenLevel() + action.oxygenIncrease >= 8) {
      action.temperatureIncrease++;
    }

    // If temperature increase will place an ocean
    if (game.getTemperature() < 0 && game.getTemperature() + action.temperatureIncrease * 2 >= 0) {
      if (action.oceansToPlace === 0 && action.oceansAvailableSpaces.length === 0) {
        action.oceansAvailableSpaces = game.board.getAvailableSpacesForOcean(player);
      }
      action.oceansToPlace++;
    } else if (action.oceansToPlace > 0 && action.oceansAvailableSpaces.length === 0) {
      action.oceansAvailableSpaces = game.board.getAvailableSpacesForOcean(player);
    }

    // If venus increase will increase TR
    if (game.getVenusScaleLevel() < 16 && game.getVenusScaleLevel() + action.venusIncrease * 2 >= 16) {
      action.TRIncrease++;
    }

    action.oxygenIncrease = Math.min(action.oxygenIncrease, MAX_OXYGEN_LEVEL - game.getOxygenLevel());
    action.temperatureIncrease = Math.min(action.temperatureIncrease, (MAX_TEMPERATURE - game.getTemperature()) / 2);
    action.venusIncrease = Math.min(action.venusIncrease, (MAX_VENUS_SCALE - game.getVenusScaleLevel()) / 2);
    action.oceansToPlace = Math.min(action.oceansToPlace, MAX_OCEAN_TILES - game.board.getOceansOnBoard());

    const totalTRGain = action.TRIncrease + action.oxygenIncrease + action.temperatureIncrease + action.oceansToPlace;

    // This is how much the player will have to pay Reds
    const redTaxes = totalTRGain * REDS_RULING_POLICY_COST;

    /*
     * This could probably be saved on the player directly when said card is played
     * Also one loop would be faster but then they wouldn't be consts and it'll be a bigger chunk.
     * Anyway, this is a list of cards that can make the player get money from playing a TR-increasing card/action
     */

    // Animals
    const hasEcologicalZone = player.playedCards.some((c) => c.name === CardName.ECOLOGICAL_ZONE);
    const hasHerbivores = player.playedCards.some((c) => c.name === CardName.HERBIVORES);
    const hasMartianZoo = player.playedCards.some((c) => c.name === CardName.MARTIAN_ZOO);
    const hasMeatIndustries = player.playedCards.some((c) => c.name === CardName.MEAT_INDUSTRY);
    // Microbes
    const hasDecomposers = player.playedCards.some((c) => c.name === CardName.DECOMPOSERS);
    const hasTopsoilContract = player.playedCards.some((c) => c.name === CardName.TOPSOIL_CONTRACT);
    // Events
    const hasMediaGroup = player.playedCards.some((c) => c.name === CardName.MEDIA_GROUP);
    const hasOptimalAerobraking = player.playedCards.some((c) => c.name === CardName.OPTIMAL_AEROBRAKING);
    // Others
    const hasAdvertising = player.playedCards.some((c) => c.name === CardName.ADVERTISING);
    const hasGMOContracts = player.playedCards.some((c) => c.name === CardName.GMO_CONTRACT);
    const hasStandardTechnology = player.playedCards.some((c) => c.name === CardName.STANDARD_TECHNOLOGY);
    // Corporations
    const isAphrodite = player.isCorporation(CardName.APHRODITE);
    const isArklight = player.isCorporation(CardName.ARKLIGHT);
    const isCredicor = player.isCorporation(CardName.CREDICOR);
    const isHelion = player.isCorporation(CardName.HELION);
    const isInterplanetary = player.isCorporation(CardName.INTERPLANETARY_CINEMATICS);
    const isManutech = player.isCorporation(CardName.MANUTECH);
    const isRecyclon = player.isCorporation(CardName.RECYCLON);
    const isVitor = player.isCorporation(CardName.VITOR);

    let bonusMCFromPlay: number = 0;

    // Plants conversion
    if (action.isPlantsConversion === true) {
      if (hasHerbivores && hasMeatIndustries) bonusMCFromPlay += 2;
    }

    // Standard projects
    if (action.standardProject !== undefined) {
      if (action.standardProject !== StandardProjectType.SELLING_PATENTS && hasStandardTechnology) {
        bonusMCFromPlay += 3;
      }
      if (action.standardProject === StandardProjectType.GREENERY) {
        if (isCredicor) bonusMCFromPlay += 4;
        if (hasHerbivores && hasMeatIndustries) bonusMCFromPlay += 2;
      }
    }

    // Card play
    if (action.card !== undefined) {
      if (hasGMOContracts) {
        bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT ||  tag === Tags.MICROBE).length * 2;
      }

      if (hasTopsoilContract) {
        if (action.card.resourceType === ResourceType.MICROBE || player.getResourceCards(ResourceType.MICROBE).length > 0) {
          bonusMCFromPlay += action.microbes;
        }
        if (hasDecomposers) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT ||  tag === Tags.MICROBE).length;
        }
        if (isRecyclon) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.BUILDING).length;
        }
      }

      if (hasMeatIndustries) {
        if (action.card.resourceType === ResourceType.ANIMAL || player.getResourceCards(ResourceType.ANIMAL).length > 0) {
          bonusMCFromPlay += action.animals;
        }
        if (hasEcologicalZone) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT).length * 2;
        }
        if (hasMartianZoo) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.EARTH).length * 2;
        }
        if (isArklight) {
          bonusMCFromPlay += action.card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT).length * 2;
        }
        if (hasHerbivores && action.nonOceanToPlace === TileType.GREENERY) {
          bonusMCFromPlay += 2;
        }
      }

      if (hasAdvertising && isManutech && action.card.cost >= 20) {
        bonusMCFromPlay += 1;
      }

      if (action.card.tags.filter((tag) => tag === Tags.EVENT).length > 0) {
        if (isInterplanetary) bonusMCFromPlay += 2;
        if (hasMediaGroup) bonusMCFromPlay += 3;

        if (hasOptimalAerobraking) {
          bonusMCFromPlay += 3;
          if (isHelion) bonusMCFromPlay += 3;
        }
      }

      if (isVitor && action.card.getVictoryPoints !== undefined && action.card.getVictoryPoints(player) >= 0) {
        bonusMCFromPlay += 3;
      }

      // Get how much the player will actually pay for the card after discounts
      action.cost = player.getCardCost(action.card);
    }

    // Corporation specifics
    if (isAphrodite) bonusMCFromPlay += action.venusIncrease * 2;
    if (isHelion) bonusMCFromPlay -= action.reservedHeat;
    if (isManutech) bonusMCFromPlay += action.megaCreditsProduction;

    const totalToPay = redTaxes + action.cost - bonusMCFromPlay;

    // Player has enough M€ to cover for everything
    if (player.canAfford(totalToPay)) return {canAfford: true, oceansToPlace: action.oceansToPlace};

    let mustSpendAtMost = player.megaCredits - (redTaxes - bonusMCFromPlay) + (isHelion ? player.heat : 0);
    let missingMC: number = totalToPay - (player.megaCredits + (isHelion ? player.heat : 0));

    if (canUseSteel) {
      missingMC -= Math.min(player.steel, Math.ceil(missingMC / player.getSteelValue())) * player.getSteelValue();
    }
    if (canUseTitanium) {
      missingMC -= Math.min(player.titanium, Math.ceil(missingMC / player.getTitaniumValue())) * player.getTitaniumValue();
    }
    if (canUseMicrobes) {
      missingMC -= Math.min(player.getMicrobesCanSpend(), Math.ceil(missingMC / 2)) * 2;
    }
    if (canUseFloaters) {
      missingMC -= Math.min(player.getFloatersCanSpend(), Math.ceil(missingMC / 3)) * 3;
    }

    // If player uses steel/titanium/etc it can pay for everything but must not spend more than |mustSpendAtMost| M€ on the action/card itself
    if (missingMC <= 0) {
      /*
      * {oceansToPlace: 1, nonOceanToPlace: TileType.OCEAN} is used for Artificial Lake edge case
      * We don't want to return here as we need to compute adjacency bonuses from placing its ocean on a land space
      * Additionally, we decrease mustSpendAtMost here so that it doesn't exceed player.megacredits
      */
      if (action.nonOceanToPlace !== TileType.OCEAN) {
        return {canAfford: true, mustSpendAtMost: mustSpendAtMost, oceansToPlace: action.oceansToPlace};
      } else {
        mustSpendAtMost += missingMC;
      }
    }

    // If we still can't pay, and there's no tile to place, there's no way to get more cash, so player can't pay Reds
    if (action.oceansToPlace === 0 && action.nonOceanToPlace === undefined) {
      return {canAfford: false, oceansToPlace: action.oceansToPlace};
    }

    /*
     * Ok so if we arrived here that means we have tiles to place
     * Let's see if we can manage to pay Reds using the bonus placement from those tiles
     *
     * TODO: Include Ares adjacency bonus/malus/hazards
     * TODO: Improve calculation for placement on HELLAS special ocean tile
     */

    // Let's compute bonus M€ from each board space
    const spacesBonusMC = RedsPolicy.getBoardSpacesBonusMC(player, game, isHelion);

    /*
     * Edge case for ArtificialLake, which uses a {oceansToPlace: 1, nonOceanToPlace: TileType.OCEAN} hack for its ActionDetails
     * Making oceansToPlace = 0 does two important things here
     * First it ensures we don't enter the if block on line 316, since we are in fact only placing 1 tile, not 2 tiles
     * Second on line 341 because we have TileType.OCEAN as our "nonOceanToPlace" we will get an array of land spaces instead of ocean spaces
     */
    const oceansToPlace = action.card?.name === CardName.ARTIFICIAL_LAKE ? 0 : action.oceansToPlace;

    // And generate a tree of tile placements that provide at least |missingMC|
    const spacesTree: ISpaceTree = RedsPolicy.makeISpaceTree(
        player,
        game,
        spacesBonusMC,
        oceansToPlace,
        action.oceansAvailableSpaces,
        action.nonOceanToPlace !== undefined ? 1 : 0,
        action.nonOceanAvailableSpaces,
        missingMC
    );

    // If our tree has at least one branch, we can afford to pay Reds
    if (spacesTree.size > 0) {
      return {canAfford: true, mustSpendAtMost: Math.min(player.megaCredits, mustSpendAtMost + Math.max(...spacesBonusMC)), spaces: spacesTree, oceansToPlace: action.oceansToPlace};
    }

    // We did all we could, still can't pay
    return {canAfford: false, oceansToPlace: action.oceansToPlace};
  }


  public static getBoardSpacesBonusMC(player: Player, game: Game, isHelion: boolean = false): Array<number> {
    return game.board.spaces.map((space) => {
      let bonus = game.board.getAdjacentSpaces(space).filter(
        (adjacentSpace) => Board.isOceanSpace(adjacentSpace)).length * player.oceanBonus;

      if (space.id === SpaceName.HELLAS_OCEAN_TILE && game.gameOptions.boardName === BoardName.HELLAS) {
        bonus -= HELLAS_BONUS_OCEAN_COST;
      }

      if (isHelion) bonus += space.bonus.filter(b => b === SpaceBonus.HEAT).length;

      return bonus;
    });
  }

  public static makeISpaceTree(player: Player, game: Game, spacesBonusMC: Array<number>, oceans: number, oceansSpaces: Array<ISpace>, nonOcean: number, nonOceanSpaces: Array<ISpace>, target: number, iteration: number = 1, totalBonus: number = 0): ISpaceTree {
    const spacesTree = new Map();

    if (iteration < oceans + nonOcean) {
      oceansSpaces.forEach((space) => {
        const tempBonusMC = Array.from(spacesBonusMC);

        game.board.getAdjacentSpaces(space).forEach((s) => {
          tempBonusMC[game.board.spaces.indexOf(s)] += player.oceanBonus;
        });

        const tree = RedsPolicy.makeISpaceTree(
            player,
            game,
            tempBonusMC,
            oceans,
            oceansSpaces.filter((s) => s.id !== space.id),
            nonOcean,
            nonOceanSpaces.filter((s) => s.id !== space.id),
            target,
            iteration + 1,
            totalBonus + tempBonusMC[game.board.spaces.indexOf(space)]
        );

        if (tree.size > 0) spacesTree.set(space, tree);
      });
    } else {
      const spaces = nonOcean === 0 ? oceansSpaces : nonOceanSpaces;

      spaces.forEach((space) => {
        const bonus = totalBonus + spacesBonusMC[game.board.spaces.indexOf(space)];
        if (bonus >= target) spacesTree.set(space, undefined);
      });
    }

    return spacesTree;
  }
}