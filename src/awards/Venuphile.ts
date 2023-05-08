import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class Venuphile implements IAward {
    public name: string = 'Venuphile';
    public description: string = 'Have the most Venus tags in play'
    public getScore(player: Player): number {
      let score = player.getTagCount(Tags.VENUS, 'award');
      return score + getAdditionalScore(player);
    }
}
