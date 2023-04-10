import {CardName} from '../../CardName';
import {GameModule} from '../../GameModule';
import {CardManifest} from '../CardManifest';
import {TharsisBot} from './TharsisBot';

export const AUTOMA_CARD_MANIFEST = new CardManifest({
  module: GameModule.Automa,
  corporationCards: [
    {cardName: CardName.THARSIS_BOT, Factory: TharsisBot},
  ],
});

