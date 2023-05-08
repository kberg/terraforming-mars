import {CardType} from "../../cards/CardType";
import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Adapter implements IAward {
  public name: string = 'Adapter';
  public description: string = 'Have the most cards with requirements in play'
  
  public getScore(player: Player): number {
    let score = player.playedCards.filter((card) => {
      const isValidCardType = card.cardType !== CardType.EVENT;
      const hasRequirements = card.requirements !== undefined;

      return isValidCardType && hasRequirements;
    }).length;

    return score + getAdditionalScore(player);
  }
}
