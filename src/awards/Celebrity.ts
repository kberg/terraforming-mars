import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../cards/CardType';

export class Celebrity implements IAward {
    public name: string = 'Celebrity';
    public description: string = 'Have the most cards in play with a cost of at least 20 M€'
    public getScore(player: Player): number {
      let score = player.playedCards
        .filter((card) => (card.cost >= 20) && (card.cardType === CardType.ACTIVE || card.cardType === CardType.AUTOMATED)).length;

      return score + getAdditionalScore(player);
    }
}
