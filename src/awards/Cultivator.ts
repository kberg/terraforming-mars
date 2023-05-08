import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {TileType} from '../TileType';

export class Cultivator implements IAward {
    public name: string = 'Cultivator';
    public description: string = 'Have the most greenery tiles'
    public getScore(player: Player): number {
      let score = player.game.board.getSpaceCount(TileType.GREENERY, player);
      return score + getAdditionalScore(player);
    }
}
