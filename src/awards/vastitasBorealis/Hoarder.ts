import {Player} from "../../Player";
import {getAdditionalScore, IAward} from "../IAward";

export class Hoarder implements IAward {
  public name: string = 'Hoarder';
  public description: string = 'Have the most cards in hand'
  
  public getScore(player: Player): number {
    let score = player.cardsInHand.length;
    return score + getAdditionalScore(player);
  }
}
