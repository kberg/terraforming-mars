import {IPlayer} from '../../IPlayer';
import {RequirementType} from '../../../common/cards/RequirementType';
import {InequalityRequirement} from './InequalityRequirement';

export class ExcavationRequirement extends InequalityRequirement {
  public readonly type = RequirementType.EXCAVATION;

  public getScore(player: IPlayer): number {
    return player.underworldData.excavationTiles;
  }
}

