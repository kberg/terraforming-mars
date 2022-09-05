import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Size} from '../render/Size';
import {Card} from '../Card';

export class LunaFirstIncorporated extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.LUNA_FIRST_INCORPORATED,
      tags: [Tags.MOON],
      startingMegaCredits: 40,

      metadata: {
        description: 'You start with 40 M€, 2 steel and 2 titanium.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(40).steel(2).titanium(2).nbsp();
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.moonColonyRate({size: Size.SMALL}).any.slash(Size.LARGE)
              .moonMiningRate({size: Size.SMALL}).any.slash(Size.LARGE)
              .moonLogisticsRate({size: Size.SMALL}).any
              .startEffect.megacredits(1);
            });
            ce.vSpace();
            ce.effect(undefined, (eb) => {
              eb.moonColonyRate({size: Size.SMALL}).slash(Size.LARGE)
              .moonMiningRate({size: Size.SMALL}).slash(Size.LARGE)
              .moonLogisticsRate({size: Size.SMALL})
              .startEffect.production((pb) => pb.megacredits(1));
            });
            ce.vSpace(Size.SMALL);
            ce.text('(Effect: When any player raises a Moon rate, gain 1 M€ per step. When you raise a Moon rate, gain 1 M€ production per step.)', Size.TINY, false, false);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    MoonExpansion.moonData(player.game).lunaFirstPlayer = player;
    player.steel += 2;
    player.titanium += 2;
    return undefined;
  }
}
