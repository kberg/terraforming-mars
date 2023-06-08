import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {CarbonNanosystems} from './CarbonNanosystems';
import {CloudTourism} from './CloudTourism';
import {TerraformingDeal} from './TerraformingDeal';

export const PRELUDE_TWO_CARD_MANIFEST = new CardManifest({
  module: GameModule.PreludeTwo,
  projectCards: [
    {cardName: CardName.CARBON_NANOSYSTEMS, Factory: CarbonNanosystems, compatibility: GameModule.Promo},
    {cardName: CardName.CLOUD_TOURISM, Factory: CloudTourism, compatibility: GameModule.Venus},
  ],
  corporationCards: [
  ],
  preludeCards: [
    {cardName: CardName.TERRAFORMING_DEAL, Factory: TerraformingDeal},
  ],
});

