import {Tags} from "../../cards/Tags";
import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Generator implements IAward {
  public name: string = 'Generator';
  public description: string = 'Most Power tags'

  public getScore(player: Player): number {
    let score = player.getTagCount(Tags.ENERGY, 'award');
    return score + getAdditionalScore(player);
  }
}
