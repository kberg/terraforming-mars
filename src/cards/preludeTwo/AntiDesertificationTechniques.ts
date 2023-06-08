import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PreludeCard} from '../prelude/PreludeCard';
import {Tags} from '../Tags';

export class AntiDesertificationTechniques extends PreludeCard {
  constructor() {
    super({
      name: CardName.ANTI_DESERTIFICATION_TECHNIQUES,
      tags: [Tags.MICROBE, Tags.PLANT],
      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1).steel(1));
          b.megacredits(5);
        }),
        description: 'Increase your plant and steel production 1 step each. Gain 5 M€.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 1);
    player.addProduction(Resources.PLANTS, 1);
    player.addResource(Resources.MEGACREDITS, 5);
    return undefined;
  }
}

