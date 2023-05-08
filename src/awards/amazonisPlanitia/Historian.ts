import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Historian implements IAward {
  public name: string = 'Historian';
  public description: string = 'Play the most event cards';

  public getScore(player: Player): number {
    let score = player.getPlayedEventsCount();
    return score + getAdditionalScore(player);
  }
}
