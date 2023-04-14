import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {AphroditeBot} from './AphroditeBot';
import {CredicorBot} from './CredicorBot';
import {EcolineBot} from './EcolineBot';
import {HelionBot} from './HelionBot';
import {MonsInsuranceBot} from './MonsInsuranceBot';
import {TharsisBot} from './TharsisBot';
import {ThorgateBot} from './ThorgateBot';
import {UNMIBot} from './UNMIBot';
import {VitorBot} from './VitorBot';

export const AUTOMA_CARD_MANIFEST = new CardManifest({
  module: GameModule.Automa,
  corporationCards: [
    {cardName: CardName.THARSIS_BOT, Factory: TharsisBot},
    {cardName: CardName.CREDICOR_BOT, Factory: CredicorBot},
    {cardName: CardName.HELION_BOT, Factory: HelionBot},
    {cardName: CardName.UNMI_BOT, Factory: UNMIBot},
    {cardName: CardName.ECOLINE_BOT, Factory: EcolineBot},
    {cardName: CardName.MONS_INSURANCE_BOT, Factory: MonsInsuranceBot},
    {cardName: CardName.VITOR_BOT, Factory: VitorBot},
    {cardName: CardName.THORGATE_BOT, Factory: ThorgateBot},
    {cardName: CardName.APHRODITE_BOT, Factory: AphroditeBot},
  ],
});

