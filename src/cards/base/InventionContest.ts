import {Card} from '../Card';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {DeferredAction, Priority} from '../../deferredActions/DeferredAction';

export class InventionContest extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INVENTION_CONTEST,
      tags: [Tags.SCIENCE],
      cost: 2,

      metadata: {
        cardNumber: '192',
        renderData: CardRenderer.builder((b) => {
          b.text('Look at the top 3 cards from the deck. Take 1 of them into hand and discard the other two', Size.SMALL, true);
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new DeferredAction(player, () => player.drawCardKeepSome(3, {keepMax: 1})), Priority.DRAW_CARDS_SCIENCE);
    return undefined;
  }
}
