import {CardName} from "../../CardName";
import {Player} from "../../Player";
import {CardType} from "../CardType";
import {LeaderCard} from "../LeaderCard";

export class LeadersExpansion {
  public static getBonusWildTags(player: Player) {
    const xavier = player.playedCards.find((card) => card.name === CardName.XAVIER);
    if (xavier !== undefined && (xavier as LeaderCard).opgActionIsActive === true) {
      return 2;
    }

    return 0;
  }

  public static getBonusInfluence(player: Player) {
    const darwin = player.playedCards.find((card) => card.name === CardName.DARWIN);
    if (darwin !== undefined && (darwin as LeaderCard).opgActionIsActive === true) {
      return 2;
    }

    return 0;
  }

  public static leaderActionIsUsable(player: Player): boolean {
    if (player.game.gameOptions.leadersExpansion === false) return false;

    const leaders = player.playedCards.filter((card) => card.cardType === CardType.LEADER);
    if (leaders.length === 0) return false;
    if (leaders.every((leader) => leader.canAct === undefined)) return false;

    return leaders.some((leader) => leader.canAct !== undefined && leader.canAct(player));
  }
}
