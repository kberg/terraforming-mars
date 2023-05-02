import {Tags} from "../../cards/Tags";
import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Researcher implements IMilestone {
  public name: string = 'Researcher';
  public description: string = 'Have at least 6 Science tags in play';

  public getScore(player: Player): number {
    return player.getTagCount(Tags.SCIENCE, 'milestone');
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
