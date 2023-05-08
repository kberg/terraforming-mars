
import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../cards/CardType';

export class Magnate implements IAward {
    public name: string = 'Magnate';
    public description: string = 'Have the most automated (green) cards in play'
    public getScore(player: Player): number {
      let score = player.playedCards
        .filter((card) => card.cardType === CardType.AUTOMATED).length;

      return score + getAdditionalScore(player);
    }
}
