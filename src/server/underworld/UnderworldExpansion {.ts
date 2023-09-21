import {Board} from '../boards/Board';
import {IPlayer} from '../IPlayer';
import {Space} from '../boards/Space';

export class UnderworldExpansion {
  public static identifyableSpaces(player: IPlayer) {
    const board = player.game.board;
    return board.spaces.filter((space) => space.undergroundResources === undefined);
  }

  public static identifiedSpaces(player: IPlayer) {
    const board = player.game.board;
    return board.spaces.filter((space) => space.undergroundResources !== undefined);
  }

  public static identify(player: IPlayer, space: Space) {
    if (space.undergroundResources !== undefined) {
      throw new Error('Space alrady identified');
    }
  }

  public static excavatableSpaces(player: IPlayer) {
    const board = player.game.board;
    return this.identifiedSpaces(player).filter(
      (space) =>
        space.excavatedBy === undefined &&
        (!Board.isCitySpace(space) || space.player === player),
    );
  }

  public static excavate(player: IPlayer, space: Space) {
    const board = player.game.board;
  }
}
