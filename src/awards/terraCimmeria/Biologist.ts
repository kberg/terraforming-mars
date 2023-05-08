import {Tags} from "../../cards/Tags";
import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Biologist implements IAward {
  public name: string = 'Biologist';
  public description: string = 'Have the most Animal, Plant and Microbe tags in play'

  public getScore(player: Player): number {
    let score = player.getTagCount(Tags.MICROBE, 'award') + player.getTagCount(Tags.PLANT, 'award') + player.getTagCount(Tags.ANIMAL, 'award');
    return score + getAdditionalScore(player);
  }
}
