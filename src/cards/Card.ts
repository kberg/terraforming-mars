
import {CardMetadata} from './CardMetadata';
import {CardName} from '../CardName';
import {CardType} from './CardType';
import {IAdjacencyBonus} from '../ares/IAdjacencyBonus';
import {ResourceType} from '../ResourceType';
import {Tags} from './Tags';
import {PartialUnits} from '../Units';

interface StaticCardProperties {
  adjacencyBonus?: IAdjacencyBonus;
  cardType: CardType;
  cost?: number;
  hasRequirements?: boolean;
  initialActionText?: string;
  metadata: CardMetadata;
  name: CardName;
  resourceType?: ResourceType;
  startingUnits?: PartialUnits;
  startingProduction?: PartialUnits;
  productionBox?: PartialUnits;
  tags?: Array<Tags>;
}

export const staticCardProperties = new Map<CardName, StaticCardProperties>();

export abstract class Card {
  private readonly properties: StaticCardProperties;
  constructor(properties: StaticCardProperties) {
    let staticInstance = staticCardProperties.get(properties.name);
    if (staticInstance === undefined) {
      if (properties.cardType === CardType.CORPORATION && properties.startingUnits === undefined) {
        throw new Error('must define startingUnits for corporation cards');
      }
      if (properties.cardType !== CardType.CORPORATION && properties.cost === undefined) {
        throw new Error('must define cost for non-corporation cards');
      }
      staticCardProperties.set(properties.name, properties);
      staticInstance = properties;
    }
    this.properties = staticInstance;
  }
  public get adjacencyBonus() {
    return this.properties.adjacencyBonus;
  }
  public get cardType() {
    return this.properties.cardType;
  }
  public get cost() {
    return this.properties.cost === undefined ? 0 : this.properties.cost;
  }
  public get hasRequirements() {
    return this.properties.hasRequirements;
  }
  public get initialActionText() {
    return this.properties.initialActionText;
  }
  public get metadata() {
    return this.properties.metadata;
  }
  public get name() {
    return this.properties.name;
  }
  public get resourceType() {
    return this.properties.resourceType;
  }
  public get startingUnits(): PartialUnits {
    return this.properties.startingUnits === undefined ? {} : this.properties.startingUnits;
  }
  public get startingProduction(): PartialUnits {
    return this.properties.startingProduction === undefined ? {} : this.properties.startingProduction;
  }
  public get productionBox(): PartialUnits {
    return this.properties.productionBox === undefined ? {} : this.productionBox;
  }
  public get tags() {
    return this.properties.tags === undefined ? [] : this.properties.tags;
  }
}
