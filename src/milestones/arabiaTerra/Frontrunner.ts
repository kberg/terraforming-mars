import {CardName} from "../../CardName";
import {LeaderCard} from "../../cards/LeaderCard";
import {Player} from "../../Player";
import {IMilestone} from "../IMilestone";

export class Frontrunner implements IMilestone {
  public name: string = 'Frontrunner';
  public description: string = 'Have a net total of 6 VP on played cards';

  public getScore(player: Player): number {
    let score = 0;

    for (const playedCard of player.playedCards) {
      if (playedCard.getVictoryPoints !== undefined) {
        score += playedCard.getVictoryPoints(player);
      }
    }

    // Victory points from corporation
    if (player.corporationCard !== undefined && player.corporationCard.getVictoryPoints !== undefined) {
      score += player.corporationCard.getVictoryPoints(player);
    }

    // Victory points from CEO
    if (player.cardIsInEffect(CardName.DUNCAN)) {
      const card = player.playedCards.find((c) => c.name === CardName.DUNCAN) as LeaderCard;
      if (card.isDisabled === true && card.generationUsed !== undefined) {
        score += 6 - card.generationUsed;
      }
    }

    return score;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
