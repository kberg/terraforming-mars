import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Specialist implements IMilestone {
    public name: string = 'Specialist';
    public description: string = 'Requires that you have at least 10 in production of any resource'
    public getScore(player: Player): number {
      return Math.max(player.megaCreditProduction,
        player.steelProduction,
        player.titaniumProduction,
        player.plantProduction,
        player.energyProduction,
        player.heatProduction);
    }
    public canClaim(player: Player): boolean {
      return this.getScore(player) > 9;
    }
}
