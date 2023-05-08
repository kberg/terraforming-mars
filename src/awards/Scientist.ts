import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class Scientist implements IAward {
    public name: string = 'Scientist';
    public description: string = 'Have the most Science tags in play'
    public getScore(player: Player): number {
      let score = player.getTagCount(Tags.SCIENCE, 'award');
      return score + getAdditionalScore(player);
    }
}
