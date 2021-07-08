import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {HowToPay} from './HowToPay';
import {SelectSpace} from './SelectSpace';
import {OrOptions} from './OrOptions';
import {SelectOption} from './SelectOption';
import {Player} from '../Player';

export class SelectHowToPay implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY;
    public buttonLabel: string = 'Pay'; // no input button
    constructor(
        public title: string | Message,
        public canUseSteel: boolean,
        public canUseTitanium: boolean,
        public canUseHeat: boolean,
        public amount: number,
        public cb: (howToPay: HowToPay) => SelectSpace | SelectOption| OrOptions | undefined,
    ) {
    }

    public validate(player: Player, howToPay: HowToPay) {
      if (howToPay.microbes !== 0) {
        throw new Error('Microbes are not used in SelectHowToPay');
      }
      if (howToPay.floaters !== 0) {
        throw new Error('Floaters are not used in SelectHowToPay');
      }
      if (howToPay.science !== 0) {
        throw new Error('Science is not used in SelectHowToPay');
      }

      let balance = this.amount;

      if (this.canUseHeat) {
        if (howToPay.heat < 0) {
          throw new Error('Heat cannot be negative');
        }
        if (howToPay.heat > player.heat) {
          throw new Error('Not enough heat');
        }
        balance -= howToPay.heat;
      } else if (howToPay.heat !== 0) {
        throw new Error('Cannot use heat');
      }

      if (this.canUseSteel) {
        if (howToPay.steel < 0) {
          throw new Error('Steel cannot be negative');
        }
        if (howToPay.steel > player.steel) {
          throw new Error('Not enough steel');
        }
        balance -= (howToPay.steel * player.getSteelValue());
      } else if (howToPay.steel !== 0) {
        throw new Error('Cannot use steel');
      }

      if (this.canUseTitanium) {
        if (howToPay.titanium < 0) {
          throw new Error('Titanium cannot be negative');
        }
        if (howToPay.titanium > player.titanium) {
          throw new Error('Not enough titanium');
        }
        balance -= (howToPay.titanium * player.getTitaniumValue());
      } else if (howToPay.titanium !== 0) {
        throw new Error('Cannot use titanium');
      }

      if (howToPay.megaCredits < 0) {
        throw new Error('M€ cannot be negative');
      }

      if (howToPay.megaCredits > player.megaCredits) {
        throw new Error('Not enough M€');
      }

      balance -= howToPay.megaCredits;

      if (balance > 0) {
        throw new Error(`You must spend ${balance} M€ more.`);
      }
    }
}
