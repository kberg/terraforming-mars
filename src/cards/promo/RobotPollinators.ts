import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../Tags';

export class RobotPollinators extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ROBOT_POLLINATORS,
      cost: 9,

      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      metadata: {
        cardNumber: 'X45',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
          b.plants(1).slash().plants(1).played;
        }),
        description: 'Requires 4% oxygen. Increase your plant production 1 step. Gain 1 plant for every plant tag you have.',
      },
    });
  }

  public play(player: Player) {
    const plantTags = player.getTagCount(Tags.PLANT);
    player.addProduction(Resources.PLANTS, 1);
    player.addResource(Resources.PLANTS, plantTags);
    return undefined;
  }
}
