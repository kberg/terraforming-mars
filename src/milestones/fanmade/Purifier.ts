import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Purifier implements IMilestone {
  public name: string = 'Purifier';
  public description: string = 'Remove 3 hazard tiles (excluding WGT)';

  public getScore(player: Player): number {
    return player.hazardsRemoved;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
