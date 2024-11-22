import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Briber extends BaseMilestone {
  constructor() {
    super(
      'Briber',
      'Pay 12 M€ in addition to the normal claim cost (e.g., 20 M€ in total)',
      1,
    );
  }

  // TODO(kberg): Make it possible for a player to say how many
  // spendable MC they have, and return that.
  //
  // The threshold still doesn't work, so we should probably
  // replace the visualization with an X or check.
  public getScore(player: IPlayer): number {
    return player.canAfford(player.milestoneCost()) ? 1 : 0;
  }
}
