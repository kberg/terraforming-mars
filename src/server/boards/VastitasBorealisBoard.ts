import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {Board, SpaceCosts} from './Board';
import {IPlayer} from '../IPlayer';
import {Space} from './Space';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST} from '../../common/constants';
import {MarsBoard} from './MarsBoard';

export class VastitasBorealisBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random) {
    const builder = new BoardBuilder(VastitasBorealisBoard, gameOptions, rng);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const HEAT = SpaceBonus.HEAT;
    const TITANIUM = SpaceBonus.TITANIUM;
    const TEMPERATURE = SpaceBonus.TEMPERATURE;

    // y=0
    builder.land(STEEL, STEEL).land(PLANT).land().land().volcanic(TITANIUM, TITANIUM);
    // y=1
    builder.land(STEEL, STEEL).land(STEEL).land().land().volcanic(TITANIUM).land(PLANT);
    // y=2
    builder.land(TITANIUM).land().land().land().land(DRAW_CARD).ocean(PLANT, DRAW_CARD).ocean(PLANT);
    // y=3
    builder.volcanic(STEEL, TITANIUM).volcanic(STEEL, DRAW_CARD).land(STEEL).ocean(HEAT, HEAT).ocean(HEAT, HEAT).ocean().ocean(PLANT, PLANT).land(STEEL, PLANT);
    // y=4
    builder.land().land().land().ocean(HEAT, HEAT).land(TEMPERATURE).unshufflable().land(STEEL).land().land(PLANT).ocean(TITANIUM);
    // y=5
    builder.land(PLANT).land().land(PLANT).ocean(HEAT, HEAT).land(HEAT, HEAT).land().land(PLANT).land(TITANIUM, PLANT);
    // y=6
    builder.land(PLANT, PLANT).land().ocean().land().land(STEEL, PLANT).land(PLANT).land(PLANT, PLANT);
    // y=7
    builder.ocean(PLANT).land().land(DRAW_CARD).land(STEEL).land().land(PLANT, PLANT);
    // y=8
    builder.ocean(PLANT, PLANT).land().land(PLANT).land(PLANT, PLANT).land(STEEL, PLANT);

    return builder.build();
  }

  public static deserialize(board: SerializedBoard, players: Array<IPlayer>): VastitasBorealisBoard {
    return new VastitasBorealisBoard(Board.deserializeSpaces(board.spaces, players));
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces);
  }

  public override spaceCosts(space: Space): SpaceCosts {
    const costs = super.spaceCosts(space);
    if (space.id === SpaceName.VASTITAS_BOREALIS_NORTH_POLE) {
      costs.stock.megacredits = VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST;
      costs.tr.oceans = 1;
    }
    return costs;
  }
}
