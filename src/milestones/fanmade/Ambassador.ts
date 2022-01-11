import {Player} from "../../Player";
import {Turmoil} from "../../turmoil/Turmoil";
import {IMilestone} from "../IMilestone";

export class Ambassador implements IMilestone {
  public name: string = 'Ambassador';
  public description: string = 'Have 4 party leaders and chairmanships';

  public getScore(player: Player): number {
    const turmoil = Turmoil.getTurmoil(player.game);
    const partyLeaders = turmoil.parties.filter((party) => party.partyLeader === player.id).length;

    return partyLeaders + player.totalChairmanshipsWon;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
