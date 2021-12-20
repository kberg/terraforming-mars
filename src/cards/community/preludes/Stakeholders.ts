import {Tags} from '../../Tags';
import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Resources} from '../../../Resources';
import {CardType} from '../../CardType';

export class Stakeholders extends PreludeCard {
  constructor() {
    super({
      name: CardName.STAKEHOLDERS,
      metadata: {
        cardNumber: 'Y33',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(14).br.br;
          b.cards(2).secondaryTag(Tags.EVENT);
        }),
        description: 'Gain 14 M€. Reveal cards until you reveal two Event cards. Take them into your hand and discard the rest.',
      },
    });
  }
  public play(player: Player) {
    player.addResource(Resources.MEGACREDITS, 14);
    player.drawCard(2, {cardType: CardType.EVENT});
    return undefined;
  };
}

