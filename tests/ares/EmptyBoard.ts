import {MarsBoard} from '../../src/server/boards/MarsBoard';
import {BoardBuilder} from '../../src/server/boards/BoardBuilder';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';

export class EmptyBoard extends MarsBoard {
  public static newInstance() {
    const builder = new BoardBuilder(EmptyBoard, DEFAULT_GAME_OPTIONS, new SeededRandom(1));

    // y=0
    builder.land().land().land().land().land();
    // y=1
    builder.land().land().land().land().land().land();
    // y=2
    builder.land().land().land().land().land().land().land();
    // y=3
    builder.land().land().land().land().land().land().land().land();
    // y=4
    builder.land().land().land().land().land().land().land().land().land();
    // y=5
    builder.land().land().land().land().land().land().land().land();
    // y=6
    builder.land().land().land().land().land().land().land();
    // y=7
    builder.land().land().land().land().land().land();
    // y=8
    builder.land().land().land().land().land();

    return builder.build();
  }
}
