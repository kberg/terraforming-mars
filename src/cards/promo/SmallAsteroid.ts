import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class SmallAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SMALL_ASTEROID,
      tags: [Tags.SPACE],
      cost: 10,
      tr: {temperature: 1},

      metadata: {
        cardNumber: '209',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).br;
          b.minus().plants(2).any;
        }),
        description: 'Increase temperature 1 step. Remove up to 2 plants from any player.',
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
    player.game.increaseTemperature(player, 1);
    player.game.defer(new RemoveAnyPlants(player, 2));
    return undefined;
  }
}
