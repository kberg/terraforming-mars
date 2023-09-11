import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AntiDesertificationTechniques} from './AntiDesertificationTechniques';
import {AppliedScience} from './AppliedScience';
import {AqueductSystems} from './AqueductSystems';
import {AstraMechanica} from './AstraMechanica';
import {AtmosphericEnhancers} from './AtmosphericEnhancers';
import {CarbonNanosystems} from './CarbonNanosystems';
import {CloudTourism} from './CloudTourism';
import {CyberiaSystems} from './CyberiaSystems';
import {EstablishedMethods} from './EstablishedMethods';
import {GiantSolarCollector} from './GiantSolarCollector';
import {HomeostasisBureau} from './HomeostasisBureau';
import {NirgalEnterprises} from './NirgalEnterprises';
import {StJosephOfCupertinoMission} from './StJosephOfCupertinoMission';
import {TerraformingDeal} from './TerraformingDeal';
import {TychoMagnetics} from './TychoMagnetics';

export const PRELUDE_TWO_CARD_MANIFEST = new CardManifest({
  module: GameModule.PreludeTwo,
  projectCards: [
    {cardName: CardName.ASTRA_MECHANICA, Factory: AstraMechanica},
    {cardName: CardName.AQUEDUCT_SYSTEMS, Factory: AqueductSystems},
    {cardName: CardName.CARBON_NANOSYSTEMS, Factory: CarbonNanosystems},
    {cardName: CardName.CLOUD_TOURISM, Factory: CloudTourism, compatibility: GameModule.Venus},
    {cardName: CardName.CYBERIA_SYSTEMS, Factory: CyberiaSystems},
    {cardName: CardName.HOMEOSTASIS_BUREAU, Factory: HomeostasisBureau},
    {cardName: CardName.ST_JOSEPH_OF_CUPERTINO_MISSION, Factory: StJosephOfCupertinoMission},
  ],
  corporationCards: [
    {cardName: CardName.NIRGAL_ENTERPRISES, Factory: NirgalEnterprises},
    {cardName: CardName.TYCHO_MAGNETICS, Factory: TychoMagnetics},
  ],
  preludeCards: [
    {cardName: CardName.ANTI_DESERTIFICATION_TECHNIQUES, Factory: AntiDesertificationTechniques},
    {cardName: CardName.APPLIED_SCIENCE, Factory: AppliedScience},
    {cardName: CardName.ATMOSPHERIC_ENHANCERS, Factory: AtmosphericEnhancers, compatibility: GameModule.Venus},
    {cardName: CardName.ESTABLISHED_METHODS, Factory: EstablishedMethods},
    {cardName: CardName.GIANT_SOLAR_COLLECTOR, Factory: GiantSolarCollector, compatibility: GameModule.Venus},
    {cardName: CardName.TERRAFORMING_DEAL, Factory: TerraformingDeal},
  ],
});
