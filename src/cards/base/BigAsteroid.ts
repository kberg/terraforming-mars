import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class BigAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BIG_ASTEROID,
      tags: [Tags.SPACE],
      cost: 27,
      tr: {temperature: 2},

      metadata: {
        description: 'Raise temperature 2 steps and gain 4 titanium. Remove up to 4 Plants from any player.',
        cardNumber: '011',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.titanium(4).br;
          b.minus().plants(-4).any;
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
    player.game.increaseTemperature(player, 2);
    player.game.defer(new RemoveAnyPlants(player, 4));
    player.titanium += 4;
    return undefined;
  }
}
