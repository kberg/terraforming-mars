import {CardType} from "../../cards/CardType";
import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Dignitary implements IMilestone {
  public name: string = 'Dignitary';
  public description: string = 'Have at least 4 cards in play with a cost of 20 M€ or more';

  public getScore(player: Player): number {
    return player.playedCards.filter((card) => card.cost >= 20 && [CardType.ACTIVE, CardType.AUTOMATED].includes(card.cardType)).length;;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
