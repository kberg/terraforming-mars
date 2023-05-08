import {getAdditionalScore, IAward} from './../IAward';
import {Player} from '../../Player';
import {isAresTile} from '../../TileType';

export class Rugged implements IAward {
    public name: string = 'Rugged';
    public description: string = 'Have the most tiles adjacent to hazards'
    public getScore(player: Player): number {
      let score = player.game.board.spaces.filter((space) =>
        space.player === player &&
        space.tile !== undefined &&
        isAresTile(space.tile.tileType) === false &&
        player.game.board.getAdjacentSpaces(space).some((space) => space.tile !== undefined && isAresTile(space.tile.tileType)),
      ).length;

      return score + getAdditionalScore(player);
    }
}
