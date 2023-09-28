import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {ActionCard} from '../ActionCard';
import {all, digit} from '../Options';
import {IPlayer} from '../../IPlayer';

export class MiningMarketInsider extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MINING_MARKET_INSIDER,
      cost: 5,
      tags: [Tag.EARTH],

      action: {
        spend: {resourcesHere: 4},
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'U46',
        renderData: CardRenderer.builder((b) => {
          b.effect('After any player identifies 1 or more underground spaces (at once), add 1 data resource to this card.',
            (ab) => ab.identify(1, {all}).startEffect.data()).br;
          b.action('Spend 4 data resources on this card to draw a card.',
            (ab) => ab.data({amount: 4, digit}).startAction.cards(1));
        }),
      },
    });
  }
  public onIdentification(_identifyingPlayer: IPlayer, cardOwner: IPlayer, _count: number) {
    cardOwner.addResourceTo(this);
  }
}

