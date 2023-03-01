import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {DeferredAction, Priority} from './DeferredAction';

export class DiscardCards extends DeferredAction {
  constructor(
    player: Player,
    public count: number = 1,
    public title: string = 'Select ' + count + ' card' + (count > 1 ? 's' : '') + ' to discard',
  ) {
    super(player, Priority.DISCARD_CARDS);
  }

  public execute() {
    if (this.player.cardsInHand.size <= this.count) {
      for (const card of this.player.cardsInHand) {
        this.player.game.projectDeck.discard(card);
      }
      for (const card of this.player.cardsInHand) {
        this.player.cardsInHand.delete(card);
      }
      return undefined;
    }
    return new SelectCard(
      this.title,
      'Discard',
      this.player.cardsInHand,
      (cards) => {
        for (const card of cards) {
          this.player.cardsInHand.delete(card.name);
          this.player.game.projectDeck.discard(card);
        }
        return undefined;
      },
      {min: this.count, max: this.count},
    );
  }
}
