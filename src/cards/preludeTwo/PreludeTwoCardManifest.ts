import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {CarbonNanosystems} from './CarbonNanosystems';

export const PRELUDE_TWO_CARD_MANIFEST = new CardManifest({
  module: GameModule.PreludeTwo,
  projectCards: [
    {cardName: CardName.CARBON_NANOSYSTEMS, Factory: CarbonNanosystems, compatibility: GameModule.Promo},
  ],
  corporationCards: [
  ],
  preludeCards: [
  ],
});

