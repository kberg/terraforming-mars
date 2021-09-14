import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {ISpace} from '../../boards/ISpace';
import {DeferredAction, Priority} from '../../deferredActions/DeferredAction';
import {Phase} from '../../Phase';
import {Player} from '../../Player';
import {SpaceType} from '../../SpaceType';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export class Ingrid extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.INGRID,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L09',
        renderData: CardRenderer.builder((b) => {
          b.emptyTile('normal').asterix().nbsp.colon().nbsp.minus().cards(1).plus().cards(1);
          b.br;
        }),
        description: 'When you take an action that places a tile on Mars, you may discard a card to draw a card.',
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(): boolean {
   return false;
  }

  public action(): PlayerInput | undefined {
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id !== activePlayer.id) return;
    if (cardOwner.game.phase === Phase.SOLAR) return;
    if (space.spaceType === SpaceType.COLONY) return;
    if (cardOwner.cardsInHand.length === 0) return;

    cardOwner.game.defer(new DiscardCards(cardOwner), Priority.DISCARD_BEFORE_DRAW);
    cardOwner.game.defer(new DeferredAction(cardOwner, () => cardOwner.drawCard()));
  }
}
