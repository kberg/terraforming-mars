import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';
import {Space} from './Space';

const TILES_PER_ROW = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];
const MAX_OCEANS = 11;
const MAX_TEMPERATURE = 14;
const MAX_OXYGEN = 18;
const MAX_VENUS = 30;

export class AmazonisNovusBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random): AmazonisNovusBoard {
    const builder = new BoardBuilder(gameOptions, rng, TILES_PER_ROW);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const ENERGY = SpaceBonus.ENERGY;
    const DELEGATE = SpaceBonus.DELEGATE;
    const ANY_RESOURCE = SpaceBonus.ANY_RESOURCE;

    // y=0
    builder.land(STEEL).land(STEEL, STEEL).land(STEEL).land(DRAW_CARD).land(TITANIUM, TITANIUM).land();
    // y=1
    builder.ocean().land(DELEGATE).land(STEEL).land().land(PLANT).ocean(PLANT, PLANT).ocean(TITANIUM, TITANIUM);
    // y=2
    builder.ocean(STEEL, STEEL).land().land(DRAW_CARD, DRAW_CARD).land().land(PLANT).ocean().land().land();
    // y=3
    builder.land(TITANIUM).ocean().land().land().land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT, DRAW_CARD);
    // y=4
    builder.volcanic(STEEL, STEEL).land(PLANT).land(ANY_RESOURCE).land(PLANT).ocean(DRAW_CARD).land(PLANT).land(PLANT, PLANT).land(PLANT).land(ANY_RESOURCE).ocean(PLANT, PLANT);
    // y=5
    builder.land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(STEEL, PLANT, PLANT).land(PLANT).land().land(PLANT).ocean(DRAW_CARD);
    // y=6
    builder.land(PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).land(ENERGY, ENERGY).land(ENERGY).land(ENERGY, ENERGY).land().land(PLANT).land(PLANT).land();
    // y=7
    builder.land(PLANT).ocean(DRAW_CARD, DRAW_CARD).land(PLANT).land(ENERGY).land(ENERGY, ENERGY).land(PLANT).volcanic(DELEGATE, DELEGATE).land(STEEL).volcanic(DELEGATE);
    // y=8
    builder.ocean(STEEL, TITANIUM).land().land(TITANIUM).land().land().land(PLANT, PLANT).land().volcanic(TITANIUM);
    // y=9
    builder.ocean().land().land(ANY_RESOURCE).land().land(PLANT, PLANT, PLANT).land(PLANT, PLANT).volcanic(STEEL, STEEL);
    // y=10
    builder.land().land(STEEL, TITANIUM).land(STEEL, STEEL).land().land(PLANT).land(DRAW_CARD);

    const spaces = builder.build();
    return new AmazonisNovusBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, {
      maxOceans: MAX_OCEANS,
      maxTemperature: MAX_TEMPERATURE,
      maxOxygen: MAX_OXYGEN,
      maxVenus: MAX_VENUS,
    });
  }
}
