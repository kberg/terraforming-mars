import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Card} from '../../Card';
import {Player} from '../../../Player';
import {Phase} from '../../../Phase';
import {Resources} from '../../../Resources';
import {IProjectCard} from '../../IProjectCard';
import {Size} from '../../render/Size';

export class Aerotech extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.AEROTECH,
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'R59',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br;
          b.megacredits(48);
          b.corpBox('effect', (ce) => {
            ce.vSpace();
            ce.effect('During each round\'s research phase, gain 1 titanium for each card you do not buy.', (eb) => {
              eb.cards(1).startEffect.titanium(1).asterix();
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

  public static onDrawCards(player: Player, cards: IProjectCard[], selected: IProjectCard[]) {
    if (player.game.phase === Phase.RESEARCH && player.isCorporation(CardName.AEROTECH)) {
      player.addResource(Resources.TITANIUM, cards.length - selected.length, {log: true});
    }

    return undefined;
  }
}
