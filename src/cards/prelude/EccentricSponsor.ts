import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PreludeCard} from './PreludeCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {LeaderCard} from '../LeaderCard';

export class EccentricSponsor extends PreludeCard {
  constructor() {
    super({
      name: CardName.ECCENTRIC_SPONSOR,

      metadata: {
        cardNumber: 'P11',
        renderData: CardRenderer.builder((b) => {
          b.text('Play a card from hand, reducing its cost by 25 M€', Size.SMALL, true);
        }),
      },
    });
  }

  public discount = 25;

  public getCardDiscount(player: Player) {
    if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
      return this.discount;
    }
    return 0;
  }

  public play(player: Player) {
    let copiedByDoubleDown: boolean = false;

    player.game.defer(new DeferredAction(player, () => {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === CardName.DOUBLE_DOWN) {
        copiedByDoubleDown = true;
        player.cardDiscount += this.discount;
      }
      return undefined;
    }));

    let copiedByEunice: boolean = false;

    player.game.defer(new DeferredAction(player, () => {
      const eunice = player.playedCards.find((card) => card.name === CardName.EUNICE);
      if (eunice !== undefined && (eunice as LeaderCard).opgActionIsActive === true) {
        copiedByEunice = true;
        player.cardDiscount += this.discount;
      }

      return undefined;
    }));

    player.game.defer(new PlayProjectCard(player));

    // Remove the temporary discounts after playing the card
    player.game.defer(new DeferredAction(player, () => {
      if (copiedByDoubleDown) player.cardDiscount -= this.discount;
      return undefined;
    }));

    player.game.defer(new DeferredAction(player, () => {
      if (copiedByEunice) player.cardDiscount -= this.discount;
      return undefined;
    }));

    return undefined;
  }
}
