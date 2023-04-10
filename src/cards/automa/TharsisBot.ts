import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CorporationCard} from '../corporation/CorporationCard';
import { Size } from '../render/Size';

export class TharsisBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.THARSIS_BOT,
      initialActionText: 'Place a city tile',
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU02',
        description: 'During setup, place a city tile.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.city();
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Place a city tile. 1 VP per 3 cities at game end.', (eb) => {
              eb.empty().startAction.city();
            });
            ce.vSpace();
            ce.vSpace(Size.LARGE);
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 3, true),
      },
    });
  }

  public play() {
    return undefined;
  }
}
