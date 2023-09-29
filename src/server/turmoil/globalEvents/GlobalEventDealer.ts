import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {IGlobalEvent} from './IGlobalEvent';
import {SerializedGlobalEventDealer} from './SerializedGlobalEventDealer';
import {IGame} from '../../IGame';
import {GameModule} from '../../../common/cards/GameModule';

import {AquiferReleasedByPublicCouncil} from './AquiferReleasedByPublicCouncil';
import {AsteroidMining} from './AsteroidMining';
import {BalancedDevelopment} from './BalancedDevelopment';
import {CelebrityLeaders} from './CelebrityLeaders';
import {CloudSocieties} from './CloudSocieties';
import {CommunicationBoom} from './CommunicationBoom';
import {ConstantStruggle} from './ConstantStruggle';
import {CorrosiveRain} from './CorrosiveRain';
import {Diversity} from './Diversity';
import {DryDeserts} from './DryDeserts';
import {EcoSabotage} from './EcoSabotage';
import {Election} from './Election';
import {FairTradeComplaint} from './FairTradeComplaint';
import {GenerousFunding} from './GenerousFunding';
import {GlobalDustStorm} from './GlobalDustStorm';
import {HomeworldSupport} from './HomeworldSupport';
import {ImprovedEnergyTemplates} from './ImprovedEnergyTemplates';
import {InterplanetaryTrade} from './InterplanetaryTrade';
import {JovianTaxRights} from './JovianTaxRights';
import {LaggingRegulation} from './LaggingRegulation';
import {LeadershipSummit} from './LeadershipSummit';
import {MagneticFieldStimulationDelays} from './MagneticFieldStimulationDelays';
import {MediaStir} from './MediaStir';
import {MicrogravityHealthProblems} from './MicrogravityHealthProblems';
import {MigrationUnderground} from './MigrationUnderground';
import {MinersOnStrike} from './MinersOnStrike';
import {MudSlides} from './MudSlides';
import {Pandemic} from './Pandemic';
import {ParadigmBreakdown} from './ParadigmBreakdown';
import {Productivity} from './Productivity';
import {RedInfluence} from './RedInfluence';
import {Revolution} from './Revolution';
import {Riots} from './Riots';
import {Sabotage} from './Sabotage';
import {ScientificCommunity} from './ScientificCommunity';
import {SeismicPredictions} from './SeismicPredictions';
import {SnowCover} from './SnowCover';
import {SolarFlare} from './SolarFlare';
import {SolarnetShutdown} from './SolarnetShutdown';
import {SpaceRaceToMars} from './SpaceRaceToMars';
import {SpinoffProducts} from './SpinoffProducts';
import {SponsoredProjects} from './SponsoredProjects';
import {StrongSociety} from './StrongSociety';
import {SuccessfulOrganisms} from './SuccessfulOrganisms';
import {TiredEarth} from './TiredEarth';
import {VenusInfrastructure} from './VenusInfrastructure';
import {VolcanicEruptions} from './VolcanicEruptions';
import {WarOnEarth} from './WarOnEarth';

const COLONY_ONLY_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.JOVIAN_TAX_RIGHTS, JovianTaxRights],
]);

const COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS, MicrogravityHealthProblems],
]);

const VENUS_COLONY_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.CLOUD_SOCIETIES, CloudSocieties],
]);

const VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.CORROSIVE_RAIN, CorrosiveRain],
]);

const VENUS_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.VENUS_INFRASTRUCTURE, VenusInfrastructure],
]);

const POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.SPONSORED_PROJECTS, SponsoredProjects],
  [GlobalEventName.ASTEROID_MINING, AsteroidMining],
  [GlobalEventName.GENEROUS_FUNDING, GenerousFunding],
  [GlobalEventName.SUCCESSFUL_ORGANISMS, SuccessfulOrganisms],
  [GlobalEventName.PRODUCTIVITY, Productivity],
  [GlobalEventName.HOMEWORLD_SUPPORT, HomeworldSupport],
  [GlobalEventName.VOLCANIC_ERUPTIONS, VolcanicEruptions],
  [GlobalEventName.DIVERSITY, Diversity],
  [GlobalEventName.IMPROVED_ENERGY_TEMPLATES, ImprovedEnergyTemplates],
  [GlobalEventName.INTERPLANETARY_TRADE, InterplanetaryTrade],
  [GlobalEventName.CELEBRITY_LEADERS, CelebrityLeaders],
  [GlobalEventName.SPINOFF_PRODUCTS, SpinoffProducts],
  [GlobalEventName.ELECTION, Election],
  [GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL, AquiferReleasedByPublicCouncil],
  [GlobalEventName.SCIENTIFIC_COMMUNITY, ScientificCommunity],
  [GlobalEventName.STRONG_SOCIETY, StrongSociety],
]);

const NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.GLOBAL_DUST_STORM, GlobalDustStorm],
  [GlobalEventName.ECO_SABOTAGE, EcoSabotage],
  [GlobalEventName.MINERS_ON_STRIKE, MinersOnStrike],
  [GlobalEventName.MUD_SLIDES, MudSlides],
  [GlobalEventName.REVOLUTION, Revolution],
  [GlobalEventName.RIOTS, Riots],
  [GlobalEventName.SABOTAGE, Sabotage],
  [GlobalEventName.SNOW_COVER, SnowCover],
  [GlobalEventName.PANDEMIC, Pandemic],
  [GlobalEventName.WAR_ON_EARTH, WarOnEarth],
  [GlobalEventName.PARADIGM_BREAKDOWN, ParadigmBreakdown],
  [GlobalEventName.DRY_DESERTS, DryDeserts],
  [GlobalEventName.RED_INFLUENCE, RedInfluence],
  [GlobalEventName.SOLARNET_SHUTDOWN, SolarnetShutdown],
  [GlobalEventName.SOLAR_FLARE, SolarFlare],
]);

const COMMUNITY_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.LEADERSHIP_SUMMIT, LeadershipSummit],
]);

const PATHFINDERS_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.BALANCED_DEVELOPMENT, BalancedDevelopment],
  [GlobalEventName.SPACE_RACE_TO_MARS, SpaceRaceToMars],
]);

const PATHFINDERS_NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.CONSTANT_STRUGGLE, ConstantStruggle],
  [GlobalEventName.TIRED_EARTH, TiredEarth],
  [GlobalEventName.MAGNETIC_FIELD_STIMULATION_DELAYS, MagneticFieldStimulationDelays],
  [GlobalEventName.COMMUNICATION_BOOM, CommunicationBoom],
]);


const UNDERWORLD_POSITIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.LAGGING_REGULATION, LaggingRegulation],
  [GlobalEventName.MIGRATION_UNDERGROUND, MigrationUnderground],
]);

const UNDERWORLD_NEGATIVE_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  [GlobalEventName.FAIR_TRADE_COMPLAINT, FairTradeComplaint],
  [GlobalEventName.SEISMIC_PREDICTIONS, SeismicPredictions],
  [GlobalEventName.MEDIA_STIR, MediaStir],
]);

// When renaming, add the rename here and add a TODO (like the example below)
// And remember to add a test in GlobalEventDealer.spec.ts
const RENAMED_GLOBAL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  // ['Miners Of Strike' as GlobalEventName, MinersOnStrike],
]);

export const ALL_EVENTS = new Map<GlobalEventName, new() => IGlobalEvent>([
  ...Array.from(POSITIVE_GLOBAL_EVENTS),
  ...Array.from(NEGATIVE_GLOBAL_EVENTS),
  ...Array.from(COLONY_ONLY_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS),
  ...Array.from(VENUS_COLONY_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS),
  ...Array.from(VENUS_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(COMMUNITY_GLOBAL_EVENTS),
  ...Array.from(RENAMED_GLOBAL_EVENTS),
  ...Array.from(PATHFINDERS_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(PATHFINDERS_NEGATIVE_GLOBAL_EVENTS),
  ...Array.from(UNDERWORLD_POSITIVE_GLOBAL_EVENTS),
  ...Array.from(UNDERWORLD_NEGATIVE_GLOBAL_EVENTS),
]);

// Function to return a global event object by its name
export function getGlobalEventByName(globalEventName: GlobalEventName): IGlobalEvent | undefined {
  const Factory = ALL_EVENTS.get(globalEventName);

  if (Factory !== undefined) return new Factory();
  console.warn(`unable to find global event ${globalEventName}`);
  return undefined;
}

export function getGlobalEventModule(name: GlobalEventName): GameModule {
  if (PATHFINDERS_POSITIVE_GLOBAL_EVENTS.has(name)) return 'pathfinders';
  if (PATHFINDERS_NEGATIVE_GLOBAL_EVENTS.has(name)) return 'pathfinders';
  if (UNDERWORLD_POSITIVE_GLOBAL_EVENTS.has(name)) return 'underworld';
  if (UNDERWORLD_NEGATIVE_GLOBAL_EVENTS.has(name)) return 'underworld';
  if (COMMUNITY_GLOBAL_EVENTS.has(name)) return 'community';
  return 'turmoil';
}

export class GlobalEventDealer {
  constructor(
    public readonly globalEventsDeck: Array<IGlobalEvent>,
    public readonly discardedGlobalEvents: Array<IGlobalEvent>) {}

  public static newInstance(game: IGame): GlobalEventDealer {
    const events = Array.from(POSITIVE_GLOBAL_EVENTS);

    if (!game.gameOptions.removeNegativeGlobalEventsOption) {
      events.push(...Array.from(NEGATIVE_GLOBAL_EVENTS));
      if (game.gameOptions.coloniesExtension) events.push(...Array.from(COLONY_ONLY_NEGATIVE_GLOBAL_EVENTS));

      if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
        events.push(...Array.from(VENUS_COLONY_NEGATIVE_GLOBAL_EVENTS));
      }
    }

    if (game.gameOptions.venusNextExtension) events.push(...Array.from(VENUS_POSITIVE_GLOBAL_EVENTS));

    if (game.gameOptions.coloniesExtension) events.push(...Array.from(COLONY_ONLY_POSITIVE_GLOBAL_EVENTS));

    if (game.gameOptions.venusNextExtension && game.gameOptions.coloniesExtension) {
      events.push(...Array.from(VENUS_COLONY_POSITIVE_GLOBAL_EVENTS));
    }

    if (game.gameOptions.communityCardsOption) events.push(...Array.from(COMMUNITY_GLOBAL_EVENTS));

    if (game.gameOptions.pathfindersExpansion) {
      events.push(...Array.from(PATHFINDERS_POSITIVE_GLOBAL_EVENTS));
      if (!game.gameOptions.removeNegativeGlobalEventsOption) {
        events.push(...Array.from(PATHFINDERS_NEGATIVE_GLOBAL_EVENTS));
      }
    }

    if (game.gameOptions.underworldExpansion) {
      events.push(...Array.from(UNDERWORLD_POSITIVE_GLOBAL_EVENTS));
      if (!game.gameOptions.removeNegativeGlobalEventsOption) {
        events.push(...Array.from(UNDERWORLD_NEGATIVE_GLOBAL_EVENTS));
      }
    }
    const globalEventsDeck = this.shuffle(events.map((cf) => new cf[1]));
    return new GlobalEventDealer(globalEventsDeck, []);
  }

  private static shuffle(cards: Array<IGlobalEvent>): Array<IGlobalEvent> {
    const deck: Array<IGlobalEvent> = [];
    const copy = cards.slice();
    while (copy.length) {
      deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return deck;
  }

  public draw(): IGlobalEvent | undefined {
    return this.globalEventsDeck.pop();
  }

  public serialize(): SerializedGlobalEventDealer {
    return {
      deck: this.globalEventsDeck.map((card) => card.name),
      discarded: this.discardedGlobalEvents.map((card) => card.name),
    };
  }

  public static deserialize(d: SerializedGlobalEventDealer): GlobalEventDealer {
    const deck: Array<IGlobalEvent> = [];
    d.deck.forEach((element: GlobalEventName) => {
      const globalEvent = getGlobalEventByName(element);
      if (globalEvent !== undefined) deck.push(globalEvent);
    });
    const discardPile: Array<IGlobalEvent> = [];
    d.discarded.forEach((element: GlobalEventName) => {
      const globalEvent = getGlobalEventByName(element);
      if (globalEvent !== undefined) discardPile.push(globalEvent);
    });
    return new GlobalEventDealer(deck, discardPile);
  }
}
