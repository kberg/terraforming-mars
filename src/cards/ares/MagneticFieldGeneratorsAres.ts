import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {MagneticFieldGeneratorsPromo} from '../promo/MagneticFieldGeneratorsPromo';

export class MagneticFieldGeneratorsAres extends MagneticFieldGeneratorsPromo {
  constructor() {
    super(
      CardName.MAGNETIC_FIELD_GENERATORS_ARES,
      {bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE]},
      {
        cardNumber: 'A27',
        renderData: CardRenderer.builder((b) => {
            b.production((pb) => {
              pb.minus().energy(4).digit.br;
              pb.plus().plants(2);
            }).br;
            b.tr(3).digit.tile(TileType.MAGNETIC_FIELD_GENERATORS, false, true).asterix();
        }),
        description: 'Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps. Place this tile. It grants adjacency bonus of 1 plant and 1 microbe.',
      },
    );
  }
}
