import {CardType} from "../../cards/CardType";
import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Dignitary implements IMilestone {
  public name: string = 'Dignitary';
  public description: string = 'Play 4 cards with a cost of at least 20 M€';

  public getScore(player: Player): number {
    return player.playedCards.filter((card) => card.cost >= 20 && [CardType.ACTIVE, CardType.AUTOMATED].includes(card.cardType)).length;;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
