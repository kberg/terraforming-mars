import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';

export class Benefactor implements IAward {
    public name: string = 'Benefactor';
    public description: string = 'Have the highest terraform rating'
    public getScore(player: Player): number {
      let score = player.getTerraformRating();
      return score + getAdditionalScore(player);
    }
}
