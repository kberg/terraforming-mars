import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Resources} from '../../Resources';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {BONUS_SECONDS_PER_ACTION} from '../../constants';
import {LeaderCard} from '../LeaderCard';

export class HeadStart extends PreludeCard {
  constructor() {
    super({
      name: CardName.HEAD_START,

      metadata: {
        cardNumber: 'X42',
        renderData: CardRenderer.builder((b) => {
          b.steel(2).nbsp().cards(1).colon().megacredits(2).asterix().br;
          b.arrow(Size.LARGE).arrow(Size.LARGE);
        }),
        description: 'Gain 2 steel. Gain 2 M€ per project card you have in hand. Immediately take 2 actions.',
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.STEEL, 2, {log: true});
    player.addResource(Resources.MEGACREDITS, 2 * player.cardsInHand.length, {log: true});

    player.game.defer(new DeferredAction(player, () => {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === CardName.DOUBLE_DOWN) {
        player.hasUsedHeadStart = false;
      }

      const eunice = player.playedCards.find((card) => card.name === CardName.EUNICE);

      if (eunice !== undefined && (eunice as LeaderCard).opgActionIsActive === true) {
        player.hasUsedHeadStart = false;
      }

      return undefined;
    }));

    player.game.defer(new DeferredAction(player, () => {
      player.actionsTakenThisRound++;
      player.actionsTakenThisGame++;
      player.timer.rebateTime(BONUS_SECONDS_PER_ACTION);
      player.takeAction();
      return undefined;
    }));

    return undefined;
  }
}
