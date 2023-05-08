import {Tags} from "../../cards/Tags";
import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Voyager implements IAward {
  public name: string = 'Voyager';
  public description: string = 'Have the most Jovian tags in play'

  public getScore(player: Player): number {
    let score = player.getTagCount(Tags.JOVIAN, 'award');
    return score + getAdditionalScore(player);
  }
}
