import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Size} from '../../render/Size';
import {Card} from '../../Card';
import {Tags} from '../../Tags';
import {IProjectCard} from '../../IProjectCard';

export class MaraboutShiritori extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MARABOUT_SHIRITORI,
      startingMegaCredits: 35,
      initialActionText: 'Draw a card with a tag of your choice',

      metadata: {
        cardNumber: 'R56',
        description: 'You start with 35 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br;
          b.megacredits(35);

          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('The next card you play costs 3 M€ less if it shares a tag with the last project card you played this generation.', (eb) => {
              eb.diverseTag(1).played.equals().nbsp(Size.SMALL).text('LAST', Size.SMALL).nbsp(Size.SMALL).diverseTag(1).played.startEffect;
              eb.megacredits(-3).asterix();
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public getCardDiscount(player: Player, card: IProjectCard) {
    if (player.lastCardPlayed === undefined) return 0;

    const tagsOnLastCardPlayed = player.lastCardPlayed.tags;
    if (tagsOnLastCardPlayed.includes(Tags.WILDCARD)) return 3;
    if (card.tags.some((tag) => tagsOnLastCardPlayed.includes(tag))) return 3;

    return 0;
  }
}
