import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';

export class Stefan extends CeoCard {
  constructor() {
    super({
      name: CardName.STEFAN,
      metadata: {
        cardNumber: 'L19',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('SELL').cards(1).colon().megacredits(3);
        }),
        description: 'Once per game, sell any number of cards from your hand for 3 M€ each.',
      },
    });
  }

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.cardsInHand.size > 0;
  }


  public action(player: Player): PlayerInput | undefined {
    return new SelectCard(
      'Sell patents',
      'Sell',
      player.cardsInHand,
      (cards: Array<IProjectCard>) => {
        player.megaCredits += cards.length * 3;

        cards.forEach((card) => {
          player.cardsInHand.delete(card.name);
          player.game.projectDeck.discard(card);
        });

        player.game.log('${0} sold ${1} patents', (b) => b.player(player).number(cards.length));
        this.isDisabled = true;
        return undefined;
      }, {min: 0, max: player.cardsInHand.size},
    );
  }
}
