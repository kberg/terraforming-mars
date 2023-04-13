import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {CredicorBot} from './CredicorBot';
import {EcolineBot} from './EcolineBot';
import {HelionBot} from './HelionBot';
import {MonsInsuranceBot} from './MonsInsuranceBot';
import {TharsisBot} from './TharsisBot';
import {UNMIBot} from './UNMIBot';

export const AUTOMA_CARD_MANIFEST = new CardManifest({
  module: GameModule.Automa,
  corporationCards: [
    {cardName: CardName.THARSIS_BOT, Factory: TharsisBot},
    {cardName: CardName.CREDICOR_BOT, Factory: CredicorBot},
    {cardName: CardName.HELION_BOT, Factory: HelionBot},
    {cardName: CardName.UNMI_BOT, Factory: UNMIBot},
    {cardName: CardName.ECOLINE_BOT, Factory: EcolineBot},
    {cardName: CardName.MONS_INSURANCE_BOT, Factory: MonsInsuranceBot},
  ],
});

