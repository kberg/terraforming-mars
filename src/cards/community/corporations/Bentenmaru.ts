import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Card} from '../../Card';
import {Tags} from '../../Tags';
import {Resources} from '../../../Resources';
import {Size} from '../../render/Size';

export class Bentenmaru extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.BENTENMARU,
      tags: [Tags.SPACE],
      startingMegaCredits: 25,

      metadata: {
        cardNumber: 'R58',
        description: 'You start with 25 M€ and 10 M€ production.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(25).production((pb) => pb.megacredits(10));

          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('When you take an action that would decrease an OPPONENT\'s production or resources, increase YOUR production or resources by that amount instead.', (eb) => {
              eb.minus(Size.SMALL).wild(1).any.production((pb) => pb.wild(1).any);
              eb.startEffect.wild(1).production((pb) => pb.wild(1));
            });
            ce.vSpace(Size.SMALL);
            ce.text('EFFECT: Each generation, when you pass, discard all your remaining M€.', Size.TINY, true);
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 10);
    return undefined;
  }
}
