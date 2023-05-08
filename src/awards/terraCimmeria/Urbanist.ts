import {Board} from "../../boards/Board";
import {Player} from "../../Player";
import {TileType} from "../../TileType";
import {getAdditionalScore, IAward} from "../IAward";

export class Urbanist implements IAward {
  public name: string = 'Urbanist';
  public description: string = 'Have the most VP from city tiles on Mars'

  public getScore(player: Player): number {
    let score = 0;

    player.game.board.spaces.forEach((space) => {
      // Victory points for greenery tiles adjacent to cities
      if (Board.isCitySpace(space) && space.player !== undefined && space.player.id === player.id) {
        const adjacent = player.game.board.getAdjacentSpaces(space);
        for (const adj of adjacent) {
          if (adj.tile && adj.tile.tileType === TileType.GREENERY) score++;
        }

        if (space.tile?.tileType === TileType.CAPITAL) {
          for (const adj of adjacent) {
            if (adj.tile && [TileType.OCEAN, TileType.OCEAN_CITY].includes(adj.tile.tileType)) score++;
          }
        }
      }
    });

    return score + getAdditionalScore(player);
  }
}
