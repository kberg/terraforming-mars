import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class GalileanMining extends PreludeCard {
  constructor() {
    super({
      name: CardName.GALILEAN_MINING,
      tags: [Tag.JOVIAN],

      behavior: {
        production: {titanium: 2},
      },
      startingMegacredits: -5,

      metadata: {
        cardNumber: 'P13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.titanium(2);
          }).br;
          b.megacredits(-5);
        }),
        description: 'Increase your titanium production 2 steps. Pay 5 M€.',
      },
    });
  }
  public override bespokeCanPlay(player: IPlayer) {
    return player.canAfford(5);
  }
  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, -this.startingMegaCredits)).andThen(() => {
      PathfindersExpansion.addToSolBank(player);
    });
    return undefined;
  }
}
