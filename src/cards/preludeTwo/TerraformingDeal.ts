import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PreludeCard} from '../prelude/PreludeCard';
import {Tags} from '../Tags';

export class TerraformingDeal extends PreludeCard {
  constructor() {
    super({
      name: CardName.TERRAFORMING_DEAL,
      tags: [Tags.EARTH],
      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each step you raise your TR, gain 2 M€.', (be) => be.tr(1).startEffect.megacredits(2));
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public static onTRIncrease(player: Player) {
    if (!player.cardIsInEffect(CardName.TERRAFORMING_DEAL)) return;
    player.addResource(Resources.MEGACREDITS, 2, {log: true});
  }
}

