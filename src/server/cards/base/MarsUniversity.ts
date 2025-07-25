import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/Priority';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';

export class MarsUniversity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARS_UNIVERSITY,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 8,
      victoryPoints: 1,

      metadata: {
        cardNumber: '073',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a science tag, including this, you may discard a card from hand to draw a card.', (eb) => {
            eb.tag(Tag.SCIENCE).startEffect.minus().cards(1).nbsp.plus().cards(1);
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
    this.onScienceTagAdded(player, scienceTags);
  }
  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    if (tag === Tag.SCIENCE) {
      this.onScienceTagAdded(player, 1);
    }
  }
  public onScienceTagAdded(player: IPlayer, count: number) {
    for (let i = 0; i < count; i++) {
      player.defer(() => {
        // No card to discard
        if (player.cardsInHand.length === 0) {
          return undefined;
        }
        return new OrOptions(
          new SelectCard('Select a card to discard', 'Discard', player.cardsInHand)
            .andThen(([card]) => {
              player.game.log('${0} is using their ${1} effect to draw a card by discarding a card.', (b) => b.player(player).card(this));
              player.discardCardFromHand(card, {log: true});
              player.drawCard();
              return undefined;
            }),
          new SelectOption('Do nothing'),
        );
      },
      Priority.DISCARD_AND_DRAW);
    }
    return undefined;
  }
}
