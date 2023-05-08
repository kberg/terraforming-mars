import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {isAresTile} from '../TileType';

export class DesertSettler implements IAward {
    public name: string = 'Desert Settler';
    public description: string = 'Have the most tiles in the bottom four rows'
    public getScore(player: Player): number {
      let score = player.game.board.spaces
        .filter((space) => space.player !== undefined &&
            space.player === player &&
            space.tile !== undefined &&
            isAresTile(space.tile.tileType) === false &&
            space.y >= 5 && space.y <= 8).length;

      return score + getAdditionalScore(player);
    }
}
