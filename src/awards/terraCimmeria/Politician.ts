import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Politician implements IAward {
  public name: string = 'Politician';
  public description: string = 'Most delegates placed during the game'

  public getScore(player: Player): number {
    let score = player.totalDelegatesPlaced;
    return score + getAdditionalScore(player);
  }
}
