import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class MiningExpedition extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.MINING_EXPEDITION,
      cost: 12,
      tr: {oxygen: 1},

      metadata: {
        cardNumber: '063',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).br;
          b.minus().plants(-2).any;
          b.steel(2);
        }),
        description: 'Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new RemoveAnyPlants(player, 2));
    player.steel += 2;
    return player.game.increaseOxygenLevel(player, 1);
  }
}
