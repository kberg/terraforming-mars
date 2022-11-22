import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class MagneticFieldGenerators extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_GENERATORS,
      tags: [Tags.BUILDING],
      cost: 20,
      tr: {tr: 3},
      productionBox: Units.of({energy: -4, plants: 2}),

      metadata: {
        cardNumber: '165',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(4).digit.br;
            pb.plus().plants(2);
          }).br;
          b.tr(3);
        }),
        description: 'Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    return player.getProduction(Resources.ENERGY) >= 4;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -4);
    player.addProduction(Resources.PLANTS, 2);
    player.increaseTerraformRatingSteps(3);
    return undefined;
  }
}
