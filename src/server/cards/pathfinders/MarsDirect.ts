import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {ICorporationCard} from '../corporation/ICorporationCard';

// TODO(kberg): This card is actually different: it uses resources to track on this card, which
// means this result can be changed by cards like CEO's Favorite Project.
// It also means cards with a wild tag may impact this.
export class MarsDirect extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.MARS_DIRECT,
      tags: [Tag.MARS],
      startingMegaCredits: 52,

      metadata: {
        description: 'You start with 52 M€.',
        cardNumber: 'PFC11',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(52).br;
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a Mars tag, you pay 1 M€ less for each Mars tag you have.', (eb) => {
              eb.tag(Tag.MARS).startEffect.megacredits(1).slash().tag(Tag.MARS);
            });
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    if (card.tags.indexOf(Tag.MARS) === -1) {
      return 0;
    }
    return player.tags.count(Tag.MARS);
  }
}
