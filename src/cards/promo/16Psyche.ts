import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';

export class SixteenPsyche extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SIXTEEN_PSYCHE,
      cost: 31,
      tags: [Tags.SPACE],
      metadata: {
        cardNumber: 'X44',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(2)).br;
          b.titanium(3);
        }),
        description: 'Increase your titanium production 2 steps. Gain 3 titanium.',
        victoryPoints: 2,
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 2);
    player.addResource(Resources.TITANIUM, 3);
    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }
}
