import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {isSpecialTile} from '../../boards/Board';
import {SelectCard} from '../../inputs/SelectCard';

// TODO(kberg): Copies a lot of Astra Mechanica
export class PatentManipulation extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PATENT_MANIPULATION,
      type: CardType.EVENT,
      cost: 7,

      victoryPoints: -2,

      requirements: {corruption: 1},

      metadata: {
        cardNumber: 'U26',
        renderData: CardRenderer.builder((b) => {
          b.text('Return 1 green or blue project card you\'ve already played ' +
            'that does not place special tiles back into your hand. ' +
            'Discard all resources from it.');
        }),
        description: 'Requires 1 corruption.',
      },
    });
  }

  private getCards(player: IPlayer): ReadonlyArray<IProjectCard> {
    return player.playedCards.filter((card) => {
      if (card.type !== CardType.AUTOMATED && card.type !== CardType.ACTIVE) {
        return false;
      }
      if ((card.tilesBuilt ?? []).some(isSpecialTile)) {
        return false;
      }
      return true;
    });
  }
  public override bespokePlay(player: IPlayer) {
    const cards = this.getCards(player);
    if (cards.length === 0) {
      player.game.log('${0} had no played blue or green project cards', (b) => b.player(player));
      return undefined;
    }
    return new SelectCard(
      'Select up a blue or green card to return to your hand',
      undefined,
      cards,
      {max: 1, min: 1})
      .andThen(([card]) => {
        player.playedCards = player.playedCards.filter((c) => c.name !== card.name);
        player.cardsInHand.push(card);
        card.resourceCount = 0;
        player.game.log('${0} returned ${1} to their hand', (b) => b.player(player).card(card));
        return undefined;
      },
      );
  }
}
