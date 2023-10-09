import {Message} from '../../common/logs/Message';
import {Units} from '../../common/Units';
import {OrOptions} from './OrOptions';
import {SelectOption} from './SelectOption';

export class SelectResource extends OrOptions {
  constructor(
    public override title: string | Message,
    public include: ReadonlyArray<keyof Units>,
    cb: (key: keyof Units) => undefined,
    optionTitle: (key: keyof Units) => string | Message = (key) => key,
  ) {
    super();
    this.buttonLabel = 'Select'; // I wonder if this should be standard.
    for (const key of include) {
      this.options.push(new SelectOption(optionTitle(key)).andThen(() => {
        cb(key);
        return undefined;
      }));
    }
  }
}
