import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {sum} from '../../../common/utils/utils';

export class Risktaker extends BaseMilestone {
  constructor() {
    super(
      'Risktaker',
      'Have at least -3 Victory Points total among your cards that have negative Victory Points. (Event cards count)',
      3);
  }

  public getScore(player: IPlayer): number {
    const total = sum(player.tableau
      .map((card) => card.getVictoryPoints(player))
      .filter((vp) => vp < 0));
    return -total;
  }
}
