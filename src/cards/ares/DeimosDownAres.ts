import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {DeimosDownPromo} from '../promo/DeimosDownPromo';

export class DeimosDownAres extends DeimosDownPromo {
  constructor() {
    super(
      CardName.DEIMOS_DOWN_ARES,
      {bonus: [SpaceBonus.ASTEROID, SpaceBonus.STEEL]},
      {
        cardNumber: 'A26',
        renderData: CardRenderer.builder((b) => {
            b.temperature(3).br;
            b.tile(TileType.DEIMOS_DOWN, false, true).asterix().br;
            b.steel(4).digit.nbsp().minus().plants(-6).any;
        }),
        description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. The tile grants an ADJACENCY BONUS of 1 asteroid and 1 steel.',
      },
    );
  }
}
