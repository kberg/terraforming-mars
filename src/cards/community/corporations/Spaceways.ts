import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Size} from '../../render/Size';
import {Card} from '../../Card';
import {Tags} from '../../Tags';
import {IProjectCard} from '../../IProjectCard';
import {Resources} from '../../../Resources';

export class Spaceways extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.SPACEWAYS,
      tags: [Tags.SPACE],
      startingMegaCredits: 42,

      metadata: {
        cardNumber: 'R55',
        description: 'You start with 42 M€ and 2 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).titanium(2);

          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.space().played.any.nbsp(Size.SMALL).event().played.any.nbsp(Size.TINY).startEffect;
              eb.megacredits(2);
            });
            ce.vSpace();
            ce.effect('When any player plays a Space Event, gain 2 M€. When you play a Space Event, increase your M€ production 1 step.', (eb) => {
              eb.space().played.event().played.startEffect;
              eb.production((pb) => pb.megacredits(1));
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.titanium = 2;

    player.drawCard(1, {
      include: (card) => card.cardType === CardType.EVENT && card.tags.includes(Tags.SPACE),
    });
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    const corpOwner = player.game.getCardPlayer(this.name);

    if (card.cardType === CardType.EVENT && card.tags.includes(Tags.SPACE)) {
      corpOwner.addResource(Resources.MEGACREDITS, 2, {log: true});

      if (player.id === corpOwner.id) {
        corpOwner.addProduction(Resources.MEGACREDITS, 1);
      }
    }
  }
}
