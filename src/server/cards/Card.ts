import {CardMetadata} from '../../common/cards/CardMetadata';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardDiscount, GlobalParameterRequirementBonus} from '../../common/cards/Types';
import {AdjacencyBonus} from '../ares/AdjacencyBonus';
import {CardResource} from '../../common/CardResource';
import {Tag} from '../../common/cards/Tag';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {TRSource} from '../../common/cards/TRSource';
import {Units} from '../../common/Units';
import {GetVictoryPointsContext, ICard} from './ICard';
import * as DynamicVictoryPoints from './render/DynamicVictoryPoints';
import {CardRenderItemType} from '../../common/cards/render/CardRenderItemType';
import {CountableVictoryPoints} from '../../common/cards/CountableVictoryPoints';
import {IProjectCard} from './IProjectCard';
import {MoonExpansion} from '../moon/MoonExpansion';
import {PlayerInput} from '../PlayerInput';
import {OneOrArray} from '../../common/utils/types';
import {TileType} from '../../common/TileType';
import {Behavior} from '../behavior/Behavior';
import {getBehaviorExecutor} from '../behavior/BehaviorExecutor';
import {Counter} from '../behavior/Counter';
import {CardRequirementsDescriptor} from './CardRequirementDescriptor';
import {CardRequirements} from './requirements/CardRequirements';
import {CardRequirementDescriptor} from '../../common/cards/CardRequirementDescriptor';
import {asArray} from '../../common/utils/utils';
import {AdditionalProjectCosts} from '../../common/cards/Types';
import {GlobalParameter} from '../../common/GlobalParameter';
import {Warning} from '../../common/cards/Warning';

/**
 * Cards that do not need a cost attribute.
 */
const CARD_TYPES_WITHOUT_COST: ReadonlyArray<CardType> = [
  CardType.CORPORATION,
  CardType.PRELUDE,
  CardType.CEO,
  CardType.STANDARD_ACTION,
] as const;

/* Properties that are the same internally and externally */
type SharedProperties = {
  /** @deprecated use behavior */
  adjacencyBonus?: AdjacencyBonus;
  action?: Behavior | undefined;
  behavior?: Behavior | undefined;
  cardCost?: number;
  cardDiscount?: OneOrArray<CardDiscount>;
  type: CardType;
  cost?: number;
  // TODO(kberg): move initialActionText to Corp shared properties
  initialActionText?: string;
  firstAction?: Behavior & {text: string};
  globalParameterRequirementBonus?: GlobalParameterRequirementBonus;
  metadata: CardMetadata;
  requirements?: CardRequirementsDescriptor;
  name: CardName;
  resourceType?: CardResource;
  protectedResources?: boolean;
  startingMegaCredits?: number;
  tags?: Array<Tag>;
  /**
   * Describes where the card's TR comes from.
   *
   * No need to be explicit about this if all the TR raising
   * comes from `behavior`.
   */

  tr?: TRSource,
  victoryPoints?: number | 'special' | CountableVictoryPoints,
}

/* Internal representation of card properties. */
type InternalProperties = SharedProperties & {
  reserveUnits?: Units,
  requirements: Array<CardRequirementsDescriptor>
  compiledRequirements: CardRequirements;
  tilesBuilt: ReadonlyArray<TileType>,
}

/* External representation of card properties. */
export type StaticCardProperties = SharedProperties & {
  reserveUnits?: Partial<Units>,
  requirements?: OneOrArray<CardRequirementDescriptor>,
  tilesBuilt?: ReadonlyArray<TileType>,
}

const cardProperties = new Map<CardName, InternalProperties>();

/**
 * Card is an implementation for most cards in the game, which provides one key features:
 *
 * 1. It stores key card properties into a static cache, which means that each instance of a card
 *    consumes very little memory.
 *
 * 2. It's key behavior is to provide a lot of the `canPlay` and `play` behavior currently
 *    in player.canPlay and player.play. These will eventually be removed and
 *    put right in here.
 *
 * In order to implement this default behavior, Card subclasses should ideally not
 * override `play` and `canPlay`. Instead, they should override `bespokeCanPlay` and
 * `bespokePlay`, which provide bespoke, or custom hand-crafted play and canPlay
 * behavior.
 *
 * If this seems counterintuitive, think about it this way: very little behavior should
 * be custom-written for each card, _no_ common behavior should be custom-written for
 * each card, either.
 */
export abstract class Card implements ICard {
  protected readonly properties: InternalProperties;
  public resourceCount = 0;
  public warnings = new Set<Warning>();
  public additionalProjectCosts?: AdditionalProjectCosts = undefined;

  private internalize(external: StaticCardProperties): InternalProperties {
    const name = external.name;
    if (external.type === CardType.CORPORATION && external.startingMegaCredits === undefined) {
      throw new Error(`${name}: corp cards must define startingMegaCredits`);
    }
    if (external.cost === undefined) {
      if (CARD_TYPES_WITHOUT_COST.includes(external.type) === false) {
        throw new Error(`${name} must have a cost property`);
      }
    }
    let step = 0;
    try {
      // TODO(kberg): apply these changes in CardVictoryPoints.vue and remove this conditional altogether.
      Card.autopopulateMetadataVictoryPoints(external);

      step = 1;
      validateBehavior(external.behavior, name);
      step = 2;
      validateBehavior(external.firstAction, name);
      step = 3;
      validateBehavior(external.action, name);
      step = 4;
      Card.validateTilesBuilt(external);
      step = 5;
    } catch (e) {
      throw new Error(`Cannot validate ${name} (${step}): ${e}`);
    }

    const translatedRequirements = asArray(external.requirements ?? []).map((req) => populateCount(req));
    const compiledRequirements = CardRequirements.compile(translatedRequirements);
    const tilesBuilt = [...external.tilesBuilt ?? []];
    if (external.behavior?.tile?.type !== undefined) {
      tilesBuilt.push(external.behavior?.tile.type);
    }
    if (external.behavior?.moon?.tile?.type !== undefined) {
      tilesBuilt.push(external.behavior.moon.tile.type);
    }
    if (external.behavior?.moon?.habitatTile !== undefined) {
      tilesBuilt.push(TileType.MOON_HABITAT);
    }
    if (external.behavior?.moon?.mineTile !== undefined) {
      tilesBuilt.push(TileType.MOON_MINE);
    }
    if (external.behavior?.moon?.roadTile !== undefined) {
      tilesBuilt.push(TileType.MOON_ROAD);
    }

    const internal: InternalProperties = {
      ...external,
      reserveUnits: external.reserveUnits === undefined ? undefined : Units.of(external.reserveUnits),
      requirements: translatedRequirements,
      compiledRequirements: compiledRequirements,
      tilesBuilt: tilesBuilt,
    };
    return internal;
  }

  constructor(external: StaticCardProperties) {
    const name = external.name;
    let internal = cardProperties.get(name);
    if (internal === undefined) {
      internal = this.internalize(external);
      cardProperties.set(name, internal);
    }
    this.properties = internal;
  }

  public get adjacencyBonus() {
    return this.properties.adjacencyBonus;
  }
  public get behavior() {
    return this.properties.behavior;
  }
  public get cardCost() {
    return this.properties.cardCost;
  }
  public get type() {
    return this.properties.type;
  }
  public get cost() {
    return this.properties.cost === undefined ? 0 : this.properties.cost;
  }
  public get initialActionText() {
    return this.properties.initialActionText || this.properties.firstAction?.text;
  }
  public get firstAction() {
    return this.properties.firstAction;
  }
  public get metadata() {
    return this.properties.metadata;
  }
  public get requirements() {
    return this.properties.requirements;
  }
  public get name() {
    return this.properties.name;
  }
  public get resourceType() {
    return this.properties.resourceType;
  }
  public get protectedResources() {
    return this.properties.protectedResources;
  }
  public get startingMegaCredits() {
    return this.properties.startingMegaCredits === undefined ? 0 : this.properties.startingMegaCredits;
  }
  public get tags() {
    return this.properties.tags === undefined ? [] : this.properties.tags;
  }
  public get cardDiscount() {
    return this.properties.cardDiscount;
  }
  public get reserveUnits(): Units {
    return this.properties.reserveUnits || Units.EMPTY;
  }
  public get tr(): TRSource | undefined {
    return this.properties.tr;
  }
  public get victoryPoints(): number | 'special' | CountableVictoryPoints | undefined {
    return this.properties.victoryPoints;
  }
  public get tilesBuilt(): ReadonlyArray<TileType> {
    return this.properties.tilesBuilt;
  }
  public canPlay(player: IPlayer, canAffordOptions?: CanAffordOptions): boolean {
    if (!this.properties.compiledRequirements.satisfies(player, this)) {
      return false;
    }
    return this.canPlayPostRequirements(player, canAffordOptions);
  }

  public canPlayPostRequirements(player: IPlayer, canAffordOptions?: CanAffordOptions) {
    if (this.behavior !== undefined) {
      if (getBehaviorExecutor().canExecute(this.behavior, player, this, canAffordOptions) === false) {
        return false;
      }
    }
    const bespokeCanPlay = this.bespokeCanPlay(player, canAffordOptions ?? {cost: 0});
    if (bespokeCanPlay === false) {
      return false;
    }
    return true;
  }
  public bespokeCanPlay(_player: IPlayer, _canAffordOptions: CanAffordOptions): boolean {
    return true;
  }

  public play(player: IPlayer): PlayerInput | undefined {
    player.stock.deductUnits(MoonExpansion.adjustedReserveCosts(player, this));
    if (this.behavior !== undefined) {
      const executor = getBehaviorExecutor();
      executor.execute(this.behavior, player, this);
    }
    return this.bespokePlay(player);
  }

  public bespokePlay(_player: IPlayer): PlayerInput | undefined {
    return undefined;
  }

  public onDiscard(player: IPlayer): void {
    if (this.behavior !== undefined) {
      getBehaviorExecutor().onDiscard(this.behavior, player, this);
    }
    this.bespokeOnDiscard(player);
  }

  public bespokeOnDiscard(_player: IPlayer): void {
  }

  public getVictoryPoints(player: IPlayer, context: GetVictoryPointsContext = 'default'): number {
    const vp = this.properties.victoryPoints;
    if (typeof(vp) === 'number') {
      return vp;
    }
    if (typeof (vp) === 'object') {
      const counter = new Counter(player, this);
      // This looks backwards, but what it's saying is:
      //   Most of the time, use the VP counter when calculating VP.
      //   But project inspection is special, and uses the regular form of calculating VP
      //   ...  which is mostly a special case for counting tags.
      switch (context) {
      case 'default':
        return counter.count(vp, 'vps');
      case 'projectWorkshop':
        return counter.count(vp, 'default');
      default:
        throw new Error('Unknown context for getVictoryPoints: ' + context);
      }
    }
    if (vp === 'special') {
      throw new Error('When victoryPoints is \'special\', override getVictoryPoints');
    }

    const vps = this.properties.metadata.victoryPoints;
    if (vps === undefined) {
      return 0;
    }

    if (typeof(vps) === 'number') return vps;

    if (vps.targetOneOrMore === true || vps.anyPlayer === true) {
      throw new Error('Not yet handled');
    }

    let units: number | undefined = 0;

    switch (vps.item?.type) {
    case CardRenderItemType.RESOURCE:
      units = this.resourceCount;
      break;
    case CardRenderItemType.TAG:
      if (vps.item.tag === undefined) {
        throw new Error('tag attribute missing');
      }
      units = player.tags.count(vps.item.tag, 'raw');
      break;
    }

    if (units === undefined) {
      throw new Error('Not yet handled');
    }
    return vps.points * Math.floor(units / vps.target);
  }

  private static autopopulateMetadataVictoryPoints(properties: StaticCardProperties) {
    const vps = properties.victoryPoints;
    if (vps === undefined) {
      return;
    }

    if (vps === 'special') {
      if (properties.metadata.victoryPoints === undefined) {
        throw new Error('When card.victoryPoints is \'special\', metadata.victoryPoints and getVictoryPoints must be supplied');
      }
      return;
    } else {
      if (properties.metadata.victoryPoints !== undefined) {
        throw new Error('card.victoryPoints and metadata.victoryPoints cannot be on the same card');
      }
    }

    if (typeof(vps) === 'number') {
      properties.metadata.victoryPoints = vps;
      return;
    }
    const each = vps.each ?? 1;
    const per = vps.per ?? 1;
    if (vps.resourcesHere !== undefined) {
      if (properties.resourceType === undefined) {
        throw new Error('When defining a card-resource based VP, resourceType must be defined.');
      }
      properties.metadata.victoryPoints = DynamicVictoryPoints.resource(properties.resourceType, each, per);
      return;
    } else if (vps.tag !== undefined) {
      properties.metadata.victoryPoints = DynamicVictoryPoints.tag(vps.tag, each, per);
    } else if (vps.cities !== undefined) {
      properties.metadata.victoryPoints = DynamicVictoryPoints.cities(each, per, vps.all);
    } else if (vps.colonies !== undefined) {
      properties.metadata.victoryPoints = DynamicVictoryPoints.colonies(each, per, vps.all);
    } else if (vps.moon !== undefined) {
      if (vps.moon.road !== undefined) {
        // vps.per is ignored
        properties.metadata.victoryPoints = DynamicVictoryPoints.moonRoadTile(each, vps.all);
      } else {
        throw new Error('moon defined, but no valid sub-object defined');
      }
    } else {
      throw new Error('Unknown VPs defined');
    }
  }

  private static validateTilesBuilt(properties: StaticCardProperties) {
    if (properties.tilesBuilt !== undefined) {
      if (properties.behavior?.tile?.type !== undefined) {
        throw new Error('tilesBuilt and behavior.tile.tileType both defined: ' + properties.name);
      }
      if (properties.behavior?.moon?.tile?.type !== undefined) {
        throw new Error('tilesBuilt and behavior.moon.tile.tileType both defined: ' + properties.name);
      }
      if (properties.behavior?.moon?.habitatTile !== undefined) {
        throw new Error('tilesBuilt and behavior.moon.habitatTile both defined: ' + properties.name);
      }
      if (properties.behavior?.moon?.mineTile !== undefined) {
        throw new Error('tilesBuilt and behavior.moon.mineTile both defined: ' + properties.name);
      }
      if (properties.behavior?.moon?.roadTile !== undefined) {
        throw new Error('tilesBuilt and behavior.moon.roadTile both defined: ' + properties.name);
      }
    }
  }

  public getCardDiscount(player: IPlayer, card: IProjectCard): number {
    if (this.cardDiscount === undefined) {
      return 0;
    }
    let sum = 0;
    const discounts = asArray(this.cardDiscount);
    for (const discount of discounts) {
      if (discount.tag === undefined) {
        sum += discount.amount;
      } else {
        const tagCount = player.tags.cardTagCount(card, discount.tag);
        if (discount.per !== 'card') {
          sum += discount.amount * tagCount;
        } else if (tagCount > 0) {
          sum += discount.amount;
        }
      }
    }
    return sum;
  }

  public getGlobalParameterRequirementBonus(player: IPlayer, parameter: GlobalParameter): number {
    if (this.properties.globalParameterRequirementBonus !== undefined) {
      const globalParameterRequirementBonus = this.properties.globalParameterRequirementBonus;
      if (globalParameterRequirementBonus.nextCardOnly === true) {
        if (player.lastCardPlayed !== this.name) {
          return 0;
        }
      }
      if (globalParameterRequirementBonus.parameter !== undefined) {
        if (globalParameterRequirementBonus.parameter !== parameter) {
          return 0;
        }
      }
      return globalParameterRequirementBonus.steps;
    }
    return 0;
  }
}

function populateCount(requirement: CardRequirementDescriptor): CardRequirementDescriptor {
  requirement.count =
    requirement.count ??
    requirement.oceans ??
    requirement.oxygen ??
    requirement.temperature ??
    requirement.venus ??
    requirement.tr ??
    requirement.resourceTypes ??
    requirement.greeneries ??
    requirement.cities ??
    requirement.colonies ??
    requirement.floaters ??
    requirement.partyLeader ??
    requirement.habitatRate ??
    requirement.miningRate ??
    requirement.logisticRate ??
    requirement.habitatTiles ??
    requirement.miningTiles ??
    requirement.roadTiles ??
    requirement.corruption ??
    requirement.undergroundTokens;

  return requirement;
}

export function validateBehavior(behavior: Behavior | undefined, name: CardName) : void {
  function validate(condition: boolean, error: string) {
    if (condition === false) {
      throw new Error(`for ${name}: ${error}`);
    }
  }
  if (behavior === undefined) {
    return;
  }
  if (behavior.spend) {
    const spend = behavior.spend;
    if (spend.megacredits) {
      validate(behavior.tr === undefined, 'spend.megacredits is not yet compatible with tr');
      validate(behavior.global === undefined, 'spend.megacredits is not yet compatible with global');
      validate(behavior.moon?.habitatRate === undefined, 'spend.megacredits is not yet compatible with moon.habitatRate');
      validate(behavior.moon?.logisticsRate === undefined, 'spend.megacredits is not yet compatible with moon.logisticsRate');
      validate(behavior.moon?.miningRate === undefined, 'spend.megacredits is not yet compatible with moon.miningRate');
    }
    // Don't spend heat with other types yet. It's probably not compatible. Check carefully.
    if (spend.heat) {
      validate(Object.keys(spend).length === 1, 'spend.heat cannot be used with another spend');
    }
  }
}
