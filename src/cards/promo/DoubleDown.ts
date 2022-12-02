import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {Size} from '../render/Size';
import {CardType} from '../CardType';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class DoubleDown extends PreludeCard {
  constructor() {
    super({
      name: CardName.DOUBLE_DOWN,

      metadata: {
        cardNumber: 'X40',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy your other prelude\'s direct effect.', Size.SMALL, true);
        }),
      },
    });
  }

  public canPlay(player: Player) {
    const playedPreludes = player.playedCards.filter((c) => c.cardType === CardType.PRELUDE);
    const eligiblePreludes = playedPreludes.filter((c) => c.canPlay === undefined || c.canPlay(player));

    return eligiblePreludes.length > 0;
  }

  public play(player: Player) {
    const game = player.game;
    const playedPreludes = player.playedCards.filter((c) => c.cardType === CardType.PRELUDE);
    const eligiblePreludes = playedPreludes.filter((c) => c.canPlay === undefined || c.canPlay(player));

    if (eligiblePreludes.length === 0) return undefined;

    if (eligiblePreludes.length === 1) {
      game.defer(new DeferredAction(player, () => eligiblePreludes[0].play(player)));
      game.log('${0} copied ${1} effect', (b) => b.player(player).card(eligiblePreludes[0]));
      return undefined;
    } else {
      return new SelectCard('Choose prelude card to copy', 'Select', eligiblePreludes, (foundCards: Array<IProjectCard>) => {
        game.defer(new DeferredAction(player, () => foundCards[0].play(player)));
        game.log('${0} copied ${1} effect', (b) => b.player(player).card(foundCards[0]));
        return undefined;
      });
    }
  }
}
