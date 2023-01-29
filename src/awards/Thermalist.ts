import {getAdditionalScore, IAward} from './IAward';
import {Player} from '../Player';
import {Resources} from '../Resources';

export class Thermalist implements IAward {
    public name: string = 'Thermalist';
    public description: string = 'Having the most heat resources'
    public getScore(player: Player): number {
      let score: number;

      if (player.game.isDoneWithFinalProduction()) {
        score = player.heat;
      } else {
        score = player.energy + player.heat + player.getProduction(Resources.HEAT);
      }

      return score + getAdditionalScore(player);
    }
}
