import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';

export class Architect extends BaseMilestone {
  constructor() {
    super(
      'Metallurgist',
      'Have 3 city tags',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.CITY, 'milestone');
  }
}
