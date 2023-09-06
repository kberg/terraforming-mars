import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AntiDesertificationTechniques} from './AntiDesertificationTechniques';
import {AppliedScience} from './AppliedScience';
import {AtmosphericEnhancers} from './AtmosphericEnhancers';
import {CarbonNanosystems} from './CarbonNanosystems';
import {CloudTourism} from './CloudTourism';
import {HomeostasisBureau} from './HomeostasisBureau';
import {TerraformingDeal} from './TerraformingDeal';
import {TychoMagnetics} from './TychoMagnetics';

export const PRELUDE_TWO_CARD_MANIFEST = new CardManifest({
  module: GameModule.PreludeTwo,
  projectCards: [
    {cardName: CardName.CARBON_NANOSYSTEMS, Factory: CarbonNanosystems, compatibility: GameModule.Promo},
    {cardName: CardName.CLOUD_TOURISM, Factory: CloudTourism, compatibility: GameModule.Venus},
    {cardName: CardName.HOMEOSTASIS_BUREAU, Factory: HomeostasisBureau},
  ],
  corporationCards: [
    {cardName: CardName.TYCHO_MAGNETICS, Factory: TychoMagnetics},
  ],
  preludeCards: [
    {cardName: CardName.ANTI_DESERTIFICATION_TECHNIQUES, Factory: AntiDesertificationTechniques},
    {cardName: CardName.APPLIED_SCIENCE, Factory: AppliedScience},
    {cardName: CardName.ATMOSPHERIC_ENHANCERS, Factory: AtmosphericEnhancers, compatibility: GameModule.Venus},
    {cardName: CardName.TERRAFORMING_DEAL, Factory: TerraformingDeal},
  ],
});
