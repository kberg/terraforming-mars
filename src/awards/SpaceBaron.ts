import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {Tags} from '../cards/Tags';

export class SpaceBaron implements IAward {
    public name: string = 'Space Baron';
    public description: string = 'Have the most Space tags in play'
    public getScore(player: Player): number {
      let score = player.getTagCount(Tags.SPACE, 'award');
      return score + getAdditionalScore(player);
    }
}
