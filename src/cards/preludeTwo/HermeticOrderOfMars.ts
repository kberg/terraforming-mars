import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {RedTourismWave} from '../turmoil/RedTourismWave';
import {Size} from '../render/Size';

export class HermeticOrderOfMars extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.HERMETIC_ORDER_OF_MARS,
      cost: 10,
      requirements: CardRequirements.builder((b) => b.oxygen(4).max()),

      metadata: {
        cardNumber: '??',
        description: 'Oxygen must be 4% or less. Increase your M€ production 2 steps. Gain 1 M€ per empty area adjacent to your tiles.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
          b.megacredits(1).slash().emptyTile('normal', Size.SMALL).asterix();
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);

    const amount = RedTourismWave.getAdjacentEmptySpacesCount(player);
    player.addResource(Resources.MEGACREDITS, amount);

    return undefined;
  }
}
