import {Player} from '../Player';
import {Random} from '../Random';
import {SpaceBonus} from '../SpaceBonus';
import {Board} from './Board';
import {BoardBuilder} from './BoardBuilder';
import {ISpace} from './ISpace';
import {SerializedBoard} from './SerializedBoard';

export class ArabiaTerraBoard extends Board {
  private constructor(public spaces: Array<ISpace>) {
    super();
  }

  public static newInstance(shuffle: boolean, rng: Random, includeVenus: boolean): ArabiaTerraBoard {
    const builder = new BoardBuilder(includeVenus);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const MICROBE = SpaceBonus.MICROBE;
    const DATA = SpaceBonus.DATA;
    const ENERGY_PRODUCTION = SpaceBonus.ENERGY_PRODUCTION;
    const SCIENCE = SpaceBonus.SCIENCE;

    // y=0
    builder.ocean().ocean(PLANT).land().land().land(DRAW_CARD, DRAW_CARD);
    // y=1
    builder.ocean(MICROBE, MICROBE, DRAW_CARD).ocean(PLANT).land(PLANT, PLANT).land().land(PLANT).land(PLANT);
    // y=2
    builder.land(PLANT, STEEL).land(PLANT).land(DRAW_CARD, DATA, DATA).land(STEEL).land(STEEL).land(STEEL, PLANT).partOcean(STEEL, TITANIUM);
    // y=3
    builder.land(PLANT, PLANT).land(PLANT).ocean(PLANT, PLANT).land().land().land().land(STEEL, STEEL).land();
    // y=4
    builder.land().land().ocean(STEEL).partOcean(ENERGY_PRODUCTION).ocean(PLANT, PLANT).land(SCIENCE, DRAW_CARD, STEEL).land().land().land();
    // y=5
    builder.land(PLANT).land(PLANT).ocean(STEEL, STEEL).land(PLANT).land(STEEL).land().partOcean(PLANT, TITANIUM).land(PLANT);
    // y=6
    builder.partOcean(PLANT, TITANIUM).ocean(PLANT, PLANT).partOcean(PLANT, PLANT).land(PLANT).land(STEEL).land(PLANT, TITANIUM).land(TITANIUM, TITANIUM);
    // y=7
    builder.ocean(PLANT, PLANT).land(PLANT).land(STEEL, DRAW_CARD).land(STEEL, STEEL).land(STEEL).land(DRAW_CARD);
    // y=8
    builder.land().land().land().land().land(STEEL);

    if (shuffle) {
      builder.shuffle(rng); // , SpaceName.HECATES_THOLUS, SpaceName.ELYSIUM_MONS, SpaceName.ARSIA_MONS_ELYSIUM, SpaceName.OLYMPUS_MONS);
    }

    const spaces = builder.build();
    return new ArabiaTerraBoard(spaces);
  }

  public getNoctisCitySpaceIds() {
    return [];
  }
  public getVolcanicSpaceIds() {
    return [];
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): ArabiaTerraBoard {
    return new ArabiaTerraBoard(Board.deserializeSpaces(board.spaces, players));
  }
}
