import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Protagonist implements IMilestone {
  public name: string = 'Protagonist';
  public description: string = 'Have at least 5 TR more than any other player';

  public getScore(player: Player): number {
    const ownTr = player.getTerraformRating();
    const highestOtherTR = Math.max(...player.game.getPlayers().filter((p) => p.id !== player.id).map((player) => player.getTerraformRating()));
    return ownTr - highestOtherTR;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
