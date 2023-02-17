import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PreludeCard} from './PreludeCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {DeferredAction} from '../../deferredActions/DeferredAction';

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
  public getCardDiscount(player: Player) {
    if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
      return 25;
    }
    return 0;
  }

  public play(player: Player) {
    let copiedByDoubleDown: boolean = false;

    player.game.defer(new DeferredAction(player, () => {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === CardName.DOUBLE_DOWN) {
        copiedByDoubleDown = true;
        player.cardDiscount += 25;
      }
      return undefined;
    }));

    player.game.defer(new PlayProjectCard(player));

    player.game.defer(new DeferredAction(player, () => {
      if (copiedByDoubleDown) player.cardDiscount -= 25;
      return undefined;
    }));

    return undefined;
  }
}
