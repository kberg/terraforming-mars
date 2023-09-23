import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class IdentifySpacesDeferred extends DeferredAction {
  private nth: number = 1;
  constructor(
    player: IPlayer,
    public count: number,
  ) {
    super(player, Priority.IDENTIFY_UNDERGROUND_RESOURCE);
  }

  private selectSpace(): PlayerInput {
    const prefix = 'Select space to identify';
    const title = prefix + (this.count > 1 ? ` (${this.nth} of ${this.count})` : '');
    return new SelectSpace(title,
      UnderworldExpansion.identifyableSpaces(this.player),
      (space) => {
        UnderworldExpansion.identify(this.player.game, space);
        this.nth++;
        if (this.nth <= this.count) {
          return this.selectSpace();
        }
        return undefined;
      });
  }
  public execute(): PlayerInput {
    return this.selectSpace();
  }
}
