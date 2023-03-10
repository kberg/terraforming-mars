import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {GreatDamPromo} from '../promo/GreatDamPromo';

export class GreatDamAres extends GreatDamPromo {
  constructor() {
    super(
      CardName.GREAT_DAM_ARES,
      {bonus: [SpaceBonus.POWER, SpaceBonus.POWER]},
      {
        cardNumber: 'A25',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2)).tile(TileType.GREAT_DAM, false, true).asterix();
        }),
        description: 'Requires 4 ocean tiles. Increase your energy production 2 steps. Place this tile ADJACENT TO an ocean tile. The tile grants an ADJACENCY BONUS of 2 energy',
        victoryPoints: 1,
      },
    );
  }
}
