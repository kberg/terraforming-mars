import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AntiDesertificationTechniques} from './AntiDesertificationTechniques';
import {AppliedScience} from './AppliedScience';
import {AqueductSystems} from './AqueductSystems';
import {AstraMechanica} from './AstraMechanica';
import {AtmosphericEnhancers} from './AtmosphericEnhancers';
import {CarbonNanosystems} from './CarbonNanosystems';
import {CeresTechMarket} from './CeresTechMarket';
import {CloudTourism} from './CloudTourism';
import {ColonyTradeHub} from './ColonyTradeHub';
import {CyberiaSystems} from './CyberiaSystems';
import {Ecotec} from './Ecotec';
import {EstablishedMethods} from './EstablishedMethods';
import {FocusedOrganization} from './FocusedOrganization';
import {GiantSolarCollector} from './GiantSolarCollector';
import {HermeticOrderOfMars} from './HermeticOrderOfMars';
import {HomeostasisBureau} from './HomeostasisBureau';
import {IshtarExpedition} from './IshtarExpedition';
import {LiTradeTerminal} from './LiTradeTerminal';
import {NirgalEnterprises} from './NirgalEnterprises';
import {NobelPrize} from './NobelPrize';
import {OldMiningColony} from './OldMiningColony';
import {RedAppeasement} from './RedAppeasement';
import {StJosephOfCupertinoMission} from './StJosephOfCupertinoMission';
import {SummitLogistics} from './SummitLogistics';
import {TerraformingDeal} from './TerraformingDeal';
import {TychoMagnetics} from './TychoMagnetics';

export const PRELUDE_TWO_CARD_MANIFEST = new CardManifest({
  module: GameModule.PreludeTwo,
  projectCards: [
    {cardName: CardName.ASTRA_MECHANICA, Factory: AstraMechanica},
    {cardName: CardName.AQUEDUCT_SYSTEMS, Factory: AqueductSystems},
    {cardName: CardName.CARBON_NANOSYSTEMS, Factory: CarbonNanosystems},
    {cardName: CardName.CERES_TECH_MARKET, Factory: CeresTechMarket, compatibility: GameModule.Colonies},
    {cardName: CardName.CLOUD_TOURISM, Factory: CloudTourism, compatibility: GameModule.Venus},
    {cardName: CardName.CYBERIA_SYSTEMS, Factory: CyberiaSystems},
    {cardName: CardName.HERMETIC_ORDER_OF_MARS, Factory: HermeticOrderOfMars},
    {cardName: CardName.HOMEOSTASIS_BUREAU, Factory: HomeostasisBureau},
    {cardName: CardName.ISHTAR_EXPEDITION, Factory: IshtarExpedition},
    {cardName: CardName.LI_TRADE_TERMINAL, Factory: LiTradeTerminal, compatibility: GameModule.Colonies},
    {cardName: CardName.RED_APPEASEMENT, Factory: RedAppeasement, compatibility: GameModule.Turmoil},
    {cardName: CardName.ST_JOSEPH_OF_CUPERTINO_MISSION, Factory: StJosephOfCupertinoMission},
    {cardName: CardName.SUMMIT_LOGISTICS, Factory: SummitLogistics, compatibility: GameModule.Turmoil},
  ],
  corporationCards: [
    {cardName: CardName.ECOTEC, Factory: Ecotec},
    {cardName: CardName.NIRGAL_ENTERPRISES, Factory: NirgalEnterprises},
    {cardName: CardName.TYCHO_MAGNETICS, Factory: TychoMagnetics},
  ],
  preludeCards: [
    {cardName: CardName.ANTI_DESERTIFICATION_TECHNIQUES, Factory: AntiDesertificationTechniques},
    {cardName: CardName.APPLIED_SCIENCE, Factory: AppliedScience},
    {cardName: CardName.ATMOSPHERIC_ENHANCERS, Factory: AtmosphericEnhancers, compatibility: GameModule.Venus},
    {cardName: CardName.COLONY_TRADE_HUB, Factory: ColonyTradeHub, compatibility: GameModule.Colonies},
    {cardName: CardName.ESTABLISHED_METHODS, Factory: EstablishedMethods},
    {cardName: CardName.FOCUSED_ORGANIZATION, Factory: FocusedOrganization},
    {cardName: CardName.GIANT_SOLAR_COLLECTOR, Factory: GiantSolarCollector, compatibility: GameModule.Venus},
    {cardName: CardName.NOBEL_PRIZE, Factory: NobelPrize},
    {cardName: CardName.OLD_MINING_COLONY, Factory: OldMiningColony, compatibility: GameModule.Colonies},
    {cardName: CardName.TERRAFORMING_DEAL, Factory: TerraformingDeal},
  ],
});