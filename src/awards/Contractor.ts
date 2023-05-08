import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class Contractor implements IAward {
    public name: string = 'Contractor';
    public description: string = 'Have the most building tags'
    public getScore(player: Player): number {
      let score = player.getTagCount(Tags.BUILDING, 'award');
      return score + getAdditionalScore(player);
    }
}
