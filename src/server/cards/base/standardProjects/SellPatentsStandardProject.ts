import {Player} from '../../../Player';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {StandardProjectCard} from '../../StandardProjectCard';
import {SelectCard} from '../../../inputs/SelectCard';
import {IProjectCard} from '../../IProjectCard';
import {multiplier} from '../../Options';

export class SellPatentsStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.SELL_PATENTS_STANDARD_PROJECT,
      cost: 0,
      metadata: {
        cardNumber: 'SP8',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Discard any number of cards to gain that amount of M€.', (eb) => {
            eb.text('X').cards(1).startAction.megacredits(0, {multiplier});
          }),
        ),
      },
    });
  }

  public override canAct(player: Player): boolean {
    return player.cardsInHand.size > 0;
  }

  actionEssence(): void {
    // no-op
  }

  public override action(player: Player): SelectCard<IProjectCard> {
    return new SelectCard(
      'Sell patents',
      'Sell',
      player.cardsInHand,
      (cards) => {
        player.megaCredits += cards.length;
        cards.forEach((card) => {
          player.playedCards.delete(card);
          player.game.projectDeck.discard(card);
        });
        this.projectPlayed(player);
        player.game.log('${0} sold ${1} patents', (b) => b.player(player).number(cards.length));
        return undefined;
      }, {max: player.cardsInHand.size, played: false},
    );
  }
}
