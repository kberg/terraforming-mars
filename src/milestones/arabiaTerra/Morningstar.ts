import {Tags} from "../../cards/Tags";
import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Morningstar implements IMilestone {
  public name: string = 'Morningstar';
  public description: string = 'Have at least 4 Venus tags in play';

  public getScore(player: Player): number {
    return player.getTagCount(Tags.VENUS, 'milestone');
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
