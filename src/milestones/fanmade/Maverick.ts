import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Maverick implements IMilestone {
  public name: string = 'Maverick';
  public description: string = 'Have at least 5 cards in play with no tags';

  public getScore(player: Player): number {
    return player.getNoTagsCount();
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
