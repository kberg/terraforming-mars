import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class DeimosDown extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DEIMOS_DOWN,
      tags: [Tags.SPACE],
      cost: 31,
      tr: {temperature: 3},

      metadata: {
        cardNumber: '039',
        description: 'Raise temperature 3 steps and gain 4 steel. Remove up to 8 Plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.steel(4).br;
          b.minus().plants(-8).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    return true;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 3);
    player.game.defer(new RemoveAnyPlants(player, 8));
    player.steel += 4;
    return undefined;
  }
}
