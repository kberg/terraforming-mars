import {CardName} from "../../CardName";
import {Player} from "../../Player";
import {VictoryPointsBreakdown} from "../../VictoryPointsBreakdown";
import {LeaderCard} from "../LeaderCard";

export class LeadersExpansion {
  public static calculateVictoryPoints(player: Player, vpb: VictoryPointsBreakdown): void {
    if (player.cardIsInEffect(CardName.DUNCAN)) {
      const card = player.playedCards.find((c) => c.name === CardName.DUNCAN) as LeaderCard;
      if (card.isDisabled === true) {
        vpb.setVictoryPoints('victoryPoints', 6 - player.game.generation, 'Leaders VP');    
      }
    }
  }

  public static getBonusWildTags(player: Player, tagCount: number) {
    const xavier = player.playedCards.find((card) => card.name === CardName.XAVIER);
    if (xavier !== undefined && (xavier as LeaderCard).opgActionIsActive === true) {
      tagCount += 2;
    }

    return tagCount;
  }
}
