import {Player} from '../Player';
import {IProjectCard} from './IProjectCard';

export interface LeaderCard extends IProjectCard {
  isDisabled?: boolean;
  opgActionIsActive?: boolean;
  generationUsed?: number;
  onTRIncrease?: (player: Player) => undefined;
  // Used for CEOs whose effect triggers need to be restricted to n times
  effectTriggerCount?: number;
}
