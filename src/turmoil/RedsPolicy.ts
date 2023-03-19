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
import {HELLAS_BONUS_OCEAN_COST, MAXIMUM_COLONY_RATE, MAXIMUM_LOGISTICS_RATE, MAXIMUM_MINING_RATE, MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from "../constants";
import {Board} from "../boards/Board";
import {ISpace} from "../boards/ISpace";
import {BoardName} from "../boards/BoardName";
import {CardType} from "../cards/CardType";
import {SpaceType} from "../SpaceType";
import {MoonExpansion} from "../moon/MoonExpansion";

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
  public moonColonyRateIncrease: number = 0; // If action increases Moon colony rate
  public moonLogisticsRateIncrease: number = 0; // If action increases Moon logistics rate
  public moonMiningRateIncrease: number = 0; // If action increases Moon mining rate
  public oceansToPlace: number = 0; // If action places an ocean tile
  public oceansAvailableSpaces: Array<ISpace> = []; // Default spaces where the ocean tile can be placed
  public nonOceanToPlace?: TileType; // If action places a non ocean tile (City, Greenery, Special, etc)
  public nonOceanAvailableSpaces: Array<ISpace> = []; // Default spaces where non ocean tile can be placed
  public animals: number = 0; // If action adds animals to a card
  public microbes: number = 0; // If action adds microbes to a card
  public bonusMegaCredits: number = 0; // If action gives you M€ - for PR Office, Colonist Shuttles, etc.
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
  // How much the player gets as rebates from project/corporation cards
  bonusMCFromPlay?: number
  // How much the player had to pay in Reds taxes
  redTaxes: number
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
    canUseMicrobes: boolean = false,
    canUseScience: boolean = false,
  ): HowToAffordRedsPolicy {
    const board = game.board;

    // If oxygen increase will increase temperature
    if (game.getOxygenLevel() < 8 && game.getOxygenLevel() + action.oxygenIncrease >= 8) {
      action.temperatureIncrease++;
    }

    // Set default oceansAvailableSpaces if action places oceans and no custom spaces were specified
    if (action.oceansToPlace > 0 && action.oceansAvailableSpaces.length === 0) {
      action.oceansAvailableSpaces = board.getAvailableSpacesForOcean(player);
    }

    // If temperature increase will place an ocean
    if (game.getTemperature() < 0 && game.getTemperature() + action.temperatureIncrease * 2 >= 0) {
      if (action.oceansToPlace === 0 && action.oceansAvailableSpaces.length === 0) {
        action.oceansAvailableSpaces = board.getAvailableSpacesForOcean(player);
      }
      action.oceansToPlace++;
    } else if (action.oceansToPlace > 0 && action.oceansAvailableSpaces.length === 0) {
      action.oceansAvailableSpaces = board.getAvailableSpacesForOcean(player);
    }

    // If venus increase will increase TR
    if (game.getVenusScaleLevel() < 16 && game.getVenusScaleLevel() + action.venusIncrease * 2 >= 16) {
      action.TRIncrease++;
    }

    action.oxygenIncrease = Math.min(action.oxygenIncrease, MAX_OXYGEN_LEVEL - game.getOxygenLevel());
    action.temperatureIncrease = Math.min(action.temperatureIncrease, (MAX_TEMPERATURE - game.getTemperature()) / 2);
    action.venusIncrease = Math.min(action.venusIncrease, (MAX_VENUS_SCALE - game.getVenusScaleLevel()) / 2);
    action.oceansToPlace = Math.min(action.oceansToPlace, MAX_OCEAN_TILES - board.getOceansOnBoard());

    action.moonColonyRateIncrease = Math.min(action.moonColonyRateIncrease, MAXIMUM_COLONY_RATE - MoonExpansion.getColonyRate(player));
    action.moonLogisticsRateIncrease = Math.min(action.moonLogisticsRateIncrease, MAXIMUM_LOGISTICS_RATE - MoonExpansion.getLogisticRate(player));
    action.moonMiningRateIncrease = Math.min(action.moonMiningRateIncrease, MAXIMUM_MINING_RATE - MoonExpansion.getMiningRate(player));

    const totalTRGain = action.TRIncrease + action.oxygenIncrease + action.temperatureIncrease + action.oceansToPlace + action.venusIncrease + action.moonColonyRateIncrease + action.moonLogisticsRateIncrease + action.moonMiningRateIncrease;

    // This is how much the player will have to pay Reds
    const redTaxes = player.cardIsInEffect(CardName.ZAN) ? 0 : totalTRGain * REDS_RULING_POLICY_COST;

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
    const isUNMO = player.isCorporation(CardName.UNITED_NATIONS_MISSION_ONE);
    const isLabourUnion = player.isCorporation(CardName.LABOUR_UNION);

    let bonusMCFromPlay: number = action.bonusMegaCredits;

    if (isUNMO) bonusMCFromPlay += totalTRGain;

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

      if (action.card.cost >= 20) {
        if (isCredicor) bonusMCFromPlay += 4;
        if (hasAdvertising && isManutech) bonusMCFromPlay += 1;
      }

      if (action.card.cardType === CardType.EVENT) {
        if (isInterplanetary) bonusMCFromPlay += 2;
        if (hasMediaGroup) bonusMCFromPlay += 3;

        if (hasOptimalAerobraking && action.card.tags.some((tag) => tag === Tags.SPACE)) {
          bonusMCFromPlay += 3;
          if (isHelion) bonusMCFromPlay += 3;
        }
      }

      if (isVitor && action.card.getVictoryPoints !== undefined && action.card.getVictoryPoints(player) >= 0) {
        bonusMCFromPlay += 3;
      }

      // Get how much the player will actually pay for the card after discounts
      action.cost = player.getCardCost(action.card);

      // Labour Union discount on standard projects
      const standardProjects = [
        CardName.ASTEROID_STANDARD_PROJECT,
        CardName.AQUIFER_STANDARD_PROJECT,
        CardName.GREENERY_STANDARD_PROJECT,
        CardName.BUFFER_GAS_STANDARD_PROJECT,
        CardName.AIR_SCRAPPING_STANDARD_PROJECT,
        CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT,
      ];

      if (isLabourUnion && standardProjects.includes(action.card.name)) {
        action.cost -= 4;
      }
    }

    // Corporation specifics
    if (isAphrodite) bonusMCFromPlay += action.venusIncrease * 2;
    if (isHelion) bonusMCFromPlay -= action.reservedHeat;
    if (isManutech) bonusMCFromPlay += action.megaCreditsProduction;

    const totalToPay = redTaxes + action.cost - bonusMCFromPlay;

    // Player has enough M€ to cover for everything
    if (player.canAfford(totalToPay)) return {canAfford: true, oceansToPlace: action.oceansToPlace, bonusMCFromPlay: bonusMCFromPlay, redTaxes: redTaxes};

    const spendableMegacredits = player.spendableMegacredits();
    let mustSpendAtMost = spendableMegacredits - (redTaxes - bonusMCFromPlay);
    let missingMC: number = totalToPay - player.spendableMegacredits();

    if (canUseSteel) {
      const steelValue = player.getSteelValue();
      const steelUsed = Math.min(player.steel, Math.ceil(missingMC / steelValue));
      missingMC -= steelUsed * steelValue;
    }
    if (canUseTitanium) {
      const titaniumValue = player.getTitaniumValue();
      const titaniumUsed = Math.min(player.titanium, Math.ceil(missingMC / titaniumValue));
      missingMC -= titaniumUsed * titaniumValue;

      /*
       * Here we have a possible scenario where a player can use multiple Ti to pay for a card
       * And at the same time they are missing (titaniumValue - 1) M€ to be able to afford this action
       * mustSpendAtMost is incremented by 1 here as long as it still remains within the player's spendable M€
       * This ensures that SelectHowToPay will display the correct M€ value when the player decrements Ti amount
       */

      if (titaniumUsed > 0 && Math.abs(missingMC) % titaniumValue === titaniumValue - 1 && mustSpendAtMost + 1 < spendableMegacredits) {
        mustSpendAtMost += 1;
      }
    }
    if (canUseMicrobes) {
      missingMC -= Math.min(player.getMicrobesCanSpend(), Math.ceil(missingMC / 2)) * 2;
    }
    if (canUseFloaters) {
      missingMC -= Math.min(player.getFloatersCanSpend(), Math.ceil(missingMC / 3)) * 3;
    }

    if (canUseScience) {
      missingMC -= Math.min(player.getSpendableScienceResources(), missingMC);
    }

    // If player uses steel/titanium/etc it can pay for everything but must not spend more than |mustSpendAtMost| M€ on the action/card itself
    if (missingMC <= 0 && mustSpendAtMost >= 0) {
      /*
       * {oceansToPlace: 1, nonOceanToPlace: TileType.OCEAN} is used for Artificial Lake edge case
       * We don't want to return here for Artificial Lake as we need to compute adjacency bonuses from placing its ocean on a land space
       * Additionally, we decrease mustSpendAtMost here so that it doesn't exceed player.megacredits
       */
      if ((action.nonOceanToPlace === undefined && action.oceansToPlace === 0) || (action.nonOceanToPlace !== undefined && action.nonOceanToPlace !== TileType.OCEAN)) {
        return {canAfford: true, mustSpendAtMost: mustSpendAtMost, oceansToPlace: action.oceansToPlace, bonusMCFromPlay: bonusMCFromPlay, redTaxes: redTaxes};
      } else {
        mustSpendAtMost += missingMC;
      }
    }

    // If we still can't pay, and there's no tile to place, there's no way to get more cash, so player can't pay Reds
    if (action.oceansToPlace === 0 && action.nonOceanToPlace === undefined) {
      return {canAfford: false, oceansToPlace: action.oceansToPlace, redTaxes: redTaxes};
    }

    /*
     * Ok so if we arrived here that means we have tiles to place
     * Let's see if we can manage to pay Reds using the bonus placement from those tiles
     *
     * TODO: Include Ares adjacency bonus/malus/hazards
     * TODO: Improve calculation for placement on HELLAS special ocean tile
     */

    /*
     * Edge case for ArtificialLake, which uses a {oceansToPlace: 1, nonOceanToPlace: TileType.OCEAN} hack for its ActionDetails
     * Making oceansToPlace = 0 does two important things here
     * First it ensures we don't enter the if block on line 316, since we are in fact only placing 1 tile, not 2 tiles
     * Second on line 341 because we have TileType.OCEAN as our "nonOceanToPlace" we will get an array of land spaces instead of ocean spaces
     */
    const oceansToPlace = action.card?.name === CardName.ARTIFICIAL_LAKE ? 0 : action.oceansToPlace;

    // Let's compute bonus M€ from each board space
    const spacesBonusMC = RedsPolicy.getBoardSpacesBonusMC(player, game, action.nonOceanAvailableSpaces, oceansToPlace, isHelion);

    // And generate a tree of tile placements that provide at least |missingMC|
    const [spacesTree, max]: [ISpaceTree, number] = RedsPolicy.makeISpaceTree(
        player,
        game,
        spacesBonusMC,
        oceansToPlace,
        action.oceansAvailableSpaces,
        action.nonOceanToPlace !== undefined ? 1 : 0,
        action.nonOceanAvailableSpaces,
        missingMC,
        mustSpendAtMost,
    );

    // If our tree has at least one branch, we can afford to pay Reds
    if (spacesTree.size > 0) {
      if (action.card !== undefined) {
        if (action.card.warning !== undefined) {
          action.card.warning += ' Tile placement will be limited due to Reds policy.';
        } else {
          action.card.warning = 'Tile placement will be limited due to Reds policy.';
        }
      }

      /*
       * If placing oceans, subsequent oceans can benefit from placing adjacent to existing/previous ones
       * There must be a better way to do this, but it's not immediately clear
       */
      const adjustment = oceansToPlace > 0 ? max : Math.max(...spacesBonusMC);
      const adjustedMustSpendAtMost = Math.min(player.megaCredits, mustSpendAtMost + adjustment);

      if (adjustedMustSpendAtMost >= 0) {
        return {
          canAfford: true,
          mustSpendAtMost: adjustedMustSpendAtMost,
          spaces: spacesTree,
          oceansToPlace: action.oceansToPlace,
          bonusMCFromPlay: bonusMCFromPlay + Math.max(...spacesBonusMC),
          redTaxes: redTaxes
        };
      }
    }

    // We did all we could, still can't pay
    return {canAfford: false, oceansToPlace: action.oceansToPlace, redTaxes: redTaxes};
  }

  public static getBoardSpacesBonusMC(player: Player, game: Game, nonOceanAvailableSpaces: ISpace[], oceansToPlace: number = 0, isHelion: boolean = false): Array<number> {
    const board = game.board;

    return board.spaces.map((space) => {
      const adjacentSpaces = board.getAdjacentSpaces(space);

      // This is the initial bonus, from placing next to EXISTING oceans
      let bonus = adjacentSpaces.filter((s) => Board.isOceanSpace(s)).length * player.oceanBonus;

      // If an action that places a non-ocean tile allows you to place oceans as well, you can get more bonus in addition to oceans already on the board
      if (oceansToPlace > 0 && nonOceanAvailableSpaces.length > 0) {
        const adjacentEmptyOceanSpacesCount = adjacentSpaces.filter((s) => s.tile === undefined && s.spaceType === SpaceType.OCEAN).length;
        const oceanAdjacencyBonus = Math.min(adjacentEmptyOceanSpacesCount, oceansToPlace) * player.oceanBonus;

        if (adjacentSpaces.some((space) => nonOceanAvailableSpaces.includes(space))) {
          bonus += oceanAdjacencyBonus;
        }
      }

      if (space.id === SpaceName.HELLAS_OCEAN_TILE && game.gameOptions.boardName === BoardName.HELLAS) {
        bonus -= HELLAS_BONUS_OCEAN_COST;
      }

      if (isHelion) bonus += space.bonus.filter(b => b === SpaceBonus.HEAT).length;

      return bonus;
    });
  }

  public static makeISpaceTree(player: Player, game: Game, spacesBonusMC: Array<number>, oceans: number, oceansSpaces: Array<ISpace>, nonOcean: number, nonOceanSpaces: Array<ISpace>, target: number, mustSpendAtMost: number, iteration: number = 1, totalBonus: number = 0, max: number = 0): [ISpaceTree, number] {
    const spacesTree = new Map();
    const board = game.board;

    if (iteration < oceans + nonOcean) {
      oceansSpaces.forEach((space) => {
        const tempBonusMC = Array.from(spacesBonusMC);
        const adjacentSpaces = board.getAdjacentSpaces(space);

        /*
         * If some adjacent space of the target space is an ocean tile,
         * OR we are placing multiple oceans that can benefit from being placed adjacent to each other,
         * grant the ocean adjacency bonus for placing on that space
         */
        adjacentSpaces.forEach((s) => {
          if (nonOceanSpaces.length === 0) {
            // Here we have no restrictions on where to place our non-ocean tile (if any)
            // So we just need to check if multiple oceans can be placed next to each other / next to existing oceans
            if (adjacentSpaces.some((adjSpace) => {
              const hasEnoughPlacementBonus = spacesBonusMC[board.spaces.indexOf(adjSpace)] >= totalBonus;
              const isOceanSpace = adjSpace.spaceType === SpaceType.OCEAN;

              return hasEnoughPlacementBonus && (adjSpace.tile !== undefined || oceans > 1) && isOceanSpace;
            })) {
              tempBonusMC[board.spaces.indexOf(s)] += player.oceanBonus;
            } else {
              tempBonusMC[board.spaces.indexOf(s)] = 0;
            }
          } else {
            // Here our non-ocean tile placement spots are restricted
            // So we can only add ocean adjacency bonus if the adjacent space is in the list of restricted non-ocean spaces
            if (adjacentSpaces.some((adjSpace) => {
              const hasEnoughPlacementBonus = spacesBonusMC[board.spaces.indexOf(adjSpace)] >= totalBonus;
              return hasEnoughPlacementBonus && nonOceanSpaces.includes(adjSpace);
            })) {
              tempBonusMC[board.spaces.indexOf(s)] += player.oceanBonus;
            } else {
              tempBonusMC[board.spaces.indexOf(s)] = 0;
            }
          }
        });

        const [tree, branchMax] = RedsPolicy.makeISpaceTree(
            player,
            game,
            tempBonusMC,
            oceans,
            oceansSpaces.filter((s) => s.id !== space.id).filter((s) => tempBonusMC[board.spaces.indexOf(s)] >= target),
            nonOcean,
            nonOceanSpaces.filter((s) => s.id !== space.id),
            target,
            mustSpendAtMost,
            iteration + 1,
            totalBonus + tempBonusMC[board.spaces.indexOf(space)],
            Math.max(...tempBonusMC),
        );

        if (branchMax > max) max = branchMax;
        if (tree.size > 0) spacesTree.set(space, tree);
      });
    } else {
      let spaces = nonOcean === 0 ? oceansSpaces : nonOceanSpaces;

      // If we are placing an ocean and we already have enough M€ to pay Reds tax, we can place on any available ocean spot
      if (Math.max(...spacesBonusMC) >= target && nonOcean === 0) spaces = board.getAvailableSpacesForOcean(player);

      /*
       * This line of code looks strange, but is actually somewhat valid
       * What actually happens here is that sometimes a player can pay for a card that raises TR with steel or titanium
       * And this causes missingMC (target) to go negative as per the operations leading up to line 262
       * These operations assume that the player always uses as much metals as possible to pay
       * A negative target implies that all spaces are eligible for tile placement as per the forEach block below
       * However during payment, the player may spend less metals than the above assumed amount and use more M€ instead
       */
      target = Math.abs(target);

      mustSpendAtMost += Math.max(...spacesBonusMC);

      spaces.forEach((space) => {
        const bonus = totalBonus + spacesBonusMC[board.spaces.indexOf(space)];
        if (bonus >= target) spacesTree.set(space, undefined);
      });
    }

    return [spacesTree, Math.max(...spacesBonusMC, max)];
  }
}