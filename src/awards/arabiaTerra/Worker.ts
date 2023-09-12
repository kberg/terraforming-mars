import {Player} from "../../Player";
import {CardType} from "../../cards/CardType";
import {getAdditionalScore, IAward} from "../IAward";

export class Worker implements IAward {
  public name: string = 'Worker';
  public description: string = 'Have the most active (blue) action cards'
  
  public getScore(player: Player): number {
    let score = player.playedCards.filter((card) => card.cardType !== CardType.PRELUDE).filter((card) => card.action !== undefined).length;

    player.corporationCards.forEach((corp) => {
      if (corp.action !== undefined) score += 1;
    });

    return score + getAdditionalScore(player);
  }
}
