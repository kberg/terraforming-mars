import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Passer implements IMilestone {
  public name: string = 'Passer';
  public description: string = 'Be the first player to pass twice consecutively';

  public getScore(player: Player): number {
    return player.consecutiveFirstPassCount;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 2;
  }
}
