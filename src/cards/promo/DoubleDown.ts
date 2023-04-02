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
    let playedPreludes = player.playedCards.filter((c) => c.cardType === CardType.PRELUDE);

    /*
     When playing Double Down during the prelude phase, it is not yet in player.playedCards and will only check other played preludes
     Eunice action however checks canPlay for all players' preludes
     If Double Down is in play, it recursively checks itself, which causes a RangeError: Maximum call stack size exceeded
     To avoid this error we need to filter out Double Down when it's checking for other copyable preludes
    */
    playedPreludes = playedPreludes.filter((p) => p.name !== this.name);

    const eligiblePreludes = playedPreludes.filter((c) => c.canPlay === undefined || c.canPlay(player));

    return eligiblePreludes.length > 0;
  }

  public play(player: Player) {
    const game = player.game;
    const playedPreludes = player.playedCards.filter((c) => c.cardType === CardType.PRELUDE);
    const eligiblePreludes = playedPreludes.filter((c) => c.name !== this.name).filter((c) => c.canPlay === undefined || c.canPlay(player));

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
