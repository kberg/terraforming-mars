import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {Board} from './Board';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';
import {Turmoil} from '../turmoil/Turmoil';
import {Space} from './Space';
import {SpaceId} from '../../common/Types';

export class VastitasBorealisNovusBoard extends MarsBoard {
  public static newInstance(gameOptions: GameOptions, rng: Random) {
    const builder = new BoardBuilder(VastitasBorealisNovusBoard, gameOptions, rng);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const HEAT = SpaceBonus.HEAT;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const TEMPERATURE = SpaceBonus.TEMPERATURE;
    const DELEGATE = SpaceBonus.DELEGATE;

    // y=0
    builder.land(PLANT).land().volcanic(STEEL).land().land();
    // y=1
    builder.land(PLANT, PLANT).land(PLANT, PLANT).land().land().land(PLANT).volcanic(DRAW_CARD);
    // y=2
    builder.land(DRAW_CARD).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(PLANT, PLANT).land(PLANT).land().land();
    // y=3
    builder.volcanic(STEEL, STEEL).land(TITANIUM).ocean(PLANT, PLANT).land(PLANT).land().land(DRAW_CARD).land(PLANT).land(DELEGATE).restricted();
    // y=4
    builder.land().land().ocean(PLANT).land(PLANT, PLANT).land(TEMPERATURE).restricted().ocean(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(DRAW_CARD, DRAW_CARD);
    // y=5
    builder.land(DRAW_CARD, DRAW_CARD).land().land(PLANT).ocean(HEAT, HEAT).ocean(HEAT, HEAT, PLANT).ocean(DRAW_CARD).land(PLANT).land(TITANIUM, TITANIUM);
    // y=6
    builder.volcanic(TITANIUM).land(STEEL).ocean().ocean(HEAT, HEAT).land(PLANT, PLANT).land(PLANT).land();
    // y=7
    builder.land(PLANT).land().land(PLANT).land(PLANT, STEEL).land(STEEL).land(PLANT);
    // y=8
    builder.land(DELEGATE).restricted().land().land(DRAW_CARD).land(STEEL).land(TITANIUM);

    return builder.build();
  }

  public constructor(spaces: ReadonlyArray<Space>, noctisCity: SpaceId | undefined, volcanicSpaceIds: ReadonlyArray<SpaceId>) {
    super(spaces, noctisCity, volcanicSpaceIds);
  }

  public override getAvailableSpacesOnLand(player: IPlayer, canAffordOptions: CanAffordOptions) {
    return super.getAvailableSpacesOnLand(player, canAffordOptions).filter((space) => {
      if (space.bonus.includes(SpaceBonus.DELEGATE)) {
        return Turmoil.ifTurmoilElse(
          player.game,
          (turmoil) => turmoil.hasDelegatesInReserve(player),
          () => true);
      }
      return true;
    });
  }

  public static deserialize(board: SerializedBoard, players: ReadonlyArray<IPlayer>): VastitasBorealisNovusBoard {
    return new VastitasBorealisNovusBoard(Board.deserializeSpaces(board.spaces, players));
  }
}
