import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {ISpace} from '../boards/ISpace';
import {InputResponse, isSelectSpaceResponse} from '../../common/inputs/InputResponse';
import {M} from '../../common/i18-n/messages';

export class SelectSpace extends BasePlayerInput {
  constructor(
    title: string | Message | M,
    public availableSpaces: ReadonlyArray<ISpace>,
    public cb: (space: ISpace) => PlayerInput | undefined) {
    super('space', title);
    if (availableSpaces.length === 0) {
      throw new Error('No available spaces');
    }
  }

  public process(input: InputResponse) {
    if (!isSelectSpaceResponse(input)) {
      throw new Error('Not a valid SelectSpaceResponse');
    }
    const space = this.availableSpaces.find(
      (space) => space.id === input.spaceId,
    );
    if (space === undefined) {
      throw new Error('Space not available');
    }
    return this.cb(space);
  }
}
