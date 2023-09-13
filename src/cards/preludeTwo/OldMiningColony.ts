import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PreludeCard} from '../prelude/PreludeCard';
import {Tags} from '../Tags';
import {BuildColony} from '../../deferredActions/BuildColony';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export class OldMiningColony extends PreludeCard {
  constructor() {
    super({
      name: CardName.OLD_MINING_COLONY,
      tags: [Tags.SPACE],
      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1));
          b.colonies(1).minus().cards(1);
        }),
        description: 'Increase your titanium production 1 step. Place a colony. Discard 1 card.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    player.game.defer(new BuildColony(player, false, 'Select where to build colony'));
    player.game.defer(new DiscardCards(player));
    return undefined;
  }
}

