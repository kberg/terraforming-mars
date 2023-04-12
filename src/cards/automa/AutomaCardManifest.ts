import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {CredicorBot} from './CredicorBot';
import {HelionBot} from './HelionBot';
import {TharsisBot} from './TharsisBot';

export const AUTOMA_CARD_MANIFEST = new CardManifest({
  module: GameModule.Automa,
  corporationCards: [
    {cardName: CardName.THARSIS_BOT, Factory: TharsisBot},
    {cardName: CardName.CREDICOR_BOT, Factory: CredicorBot},
    {cardName: CardName.HELION_BOT, Factory: HelionBot},
  ],
});

