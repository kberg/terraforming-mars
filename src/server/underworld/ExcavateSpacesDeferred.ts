import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class ExcavateSpacesDeferred extends DeferredAction {
  private nth: number = 0;
  constructor(
    player: IPlayer,
    public count: number,
    private ignorePlacementRestrictions: boolean = false,
  ) {
    super(player, Priority.EXCAVATE_UNDERGROUND_RESOURCE);
  }

  private selectSpace(): PlayerInput {
    const prefix = 'Select space to excavate';
    const title = prefix + (this.count > 1 ? ` (${this.nth} of ${this.count})` : '');
    return new SelectSpace(title,
      UnderworldExpansion.excavatableSpaces(this.player, this.ignorePlacementRestrictions),
      (space) => {
        UnderworldExpansion.excavate(this.player, space);
        this.nth++;
        if (this.nth < this.count) {
          return this.selectSpace();
        }
        return undefined;
      });
  }

  public execute(): PlayerInput {
    return this.selectSpace();
  }
}
