import {CardType} from "../../cards/CardType";
import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Economizer implements IAward {
  public name: string = 'Economizer';
  public description: string = 'Most cards in play costing 10 M€ or less'

  public getScore(player: Player): number {
    const validCardTypes = [CardType.ACTIVE, CardType.AUTOMATED];
    let score = player.playedCards
      .filter((card) => (card.cost <= 10) && validCardTypes.includes(card.cardType)).length;

    return score + getAdditionalScore(player);
  }
}
