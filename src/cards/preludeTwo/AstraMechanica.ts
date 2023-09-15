import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {SelectCard} from '../../inputs/SelectCard';

export class AstraMechanica extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ASTRA_MECHANICA,
      tags: [Tags.SCIENCE],
      cost: 7,

      metadata: {
        cardNumber: '??',
        description: 'RETURN UP TO 2 PLAYED EVENT CARDS TO YOUR HAND. THEY MAY NOT BE CARDS THAT PLACE SPECIAL TILES.',
        renderData: CardRenderer.builder((b) => {
          b.cards(2).secondaryTag(Tags.EVENT).asterix();
        }),
      },
    });
  }

  public play(player: Player) {
    const events = this.getCards(player);
    if (events.length === 0) {
      player.game.log('${0} had no events', (b) => b.player(player));
      return undefined;
    }

    return new SelectCard(
      'Select up 2 to events to return to your hand',
      'Select',
      events,
      (cards) => {
        for (const card of cards) {
          player.playedCards.splice(player.playedCards.indexOf(card), 1)[0];
          player.cardsInHand.push(card);
          player.game.log('${0} returned ${1} to their hand', (b) => b.player(player).card(card));
        }

        return undefined;
      },
      {max: 2, min: 0}
    );
  }

  private getCards(player: Player): Array<IProjectCard> {
    const eventCardsThatPlaceSpecialTiles = [
      CardName.DEIMOS_DOWN_ARES,
      CardName.DEIMOS_DOWN_PROMO,
      CardName.LAVA_FLOWS,
      CardName.LAVA_FLOWS_ARES,
      CardName.METALLIC_ASTEROID,
      CardName.LUNAR_MINE_URBANIZATION,
    ];

    return player.playedCards.filter((card) => {
      if (card.cardType !== CardType.EVENT) return false;

      if (eventCardsThatPlaceSpecialTiles.includes(card.name)) {
        return false;
      }

      return true;
    });
  }
}
