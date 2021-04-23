import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {Player} from '../Player';

export class PlayerReadyInput implements PlayerInput {
  public inputType = PlayerInputTypes.PLAYER_READY;
  public title = 'Ready?';
  public buttonLabel = 'Ready';

  constructor(
    public player: Player,
    public cb: (name: string) => undefined) {}
}
