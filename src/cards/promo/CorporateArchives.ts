import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {Size} from '../render/Size';

export class CorporateArchives extends PreludeCard {
  constructor() {
    super({
      name: CardName.CORPORATE_ARCHIVES,
      tags: [Tags.SCIENCE],

      metadata: {
        cardNumber: 'X39',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(13).br.br;
          b.text('Look at the top 7 cards from the deck. Take 2 of them into hand and discard the other 5.', Size.SMALL, true);
        }),
        description: 'Gain 13 M€.',
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.MEGACREDITS, 13);
    return player.drawCardKeepSome(7, {keepMax: 2});
  }
}
