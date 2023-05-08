import {RedTourismWave} from "../../cards/turmoil/RedTourismWave";
import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Tourist implements IAward {
  public name: string = 'Tourist';
  public description: string = 'Have the most empty spaces adjacent to your tiles';

  public getScore(player: Player): number {
    let score = RedTourismWave.getAdjacentEmptySpacesCount(player);
    return score + getAdditionalScore(player);
  }
}
