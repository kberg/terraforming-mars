import {CardName} from '../../common/cards/CardName';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {message} from '../logs/MessageBuilder';

export class MaybeBlockAttackDeferred extends DeferredAction<boolean> {
  constructor(private target: IPlayer, private perpetrator: IPlayer, private count: 1 | 2 = 1) {
    super(target, Priority.ATTACK_OPPONENT);
  }

  public execute(): PlayerInput | undefined {
    const target = this.target;
    const perpetrator = this.perpetrator;
    if (target.game.gameOptions.underworldExpansion === false) {
      return this.cb(true) ?? undefined;
    }
    const privateMilitaryContractor = target.playedCards.find((card) => card.name === CardName.PRIVATE_MILITARY_CONTRACTOR);
    const militaryContractorFighters = privateMilitaryContractor?.resourceCount ?? 0;
    if (target.underworldData.corruption + militaryContractorFighters < this.count) {
      return this.cb(true) ?? undefined;
    }
    const options = new OrOptions();
    options.title = message('Spend 1 corruption to block an attack by ${0}?', (b) => b.player(perpetrator));
    if (privateMilitaryContractor !== undefined && militaryContractorFighters > 0) {
      options.options.push(
        new SelectOption(
          message('Block with ${0} fighters.', (b) => b.cardName(CardName.PRIVATE_MILITARY_CONTRACTOR)),
          'Spend fighter')
          .andThen(() => {
            target.removeResourceFrom(privateMilitaryContractor, 1);
            target.game.log(
              '${0} spent 1 fighter on ${1} to block an attack by ${2}',
              (b) => b.player(target).cardName(CardName.PRIVATE_MILITARY_CONTRACTOR).player(perpetrator));
            return this.cb(false) ?? undefined;
          }),
      );
    }
    if (target.underworldData.corruption > 0) {
      options.options.push(
        new SelectOption('Block with corruption', 'Spend corruption')
          .andThen(() => {
            target.underworldData.corruption--;
            target.game.log(
              '${0} spent 1 corruption to block an attack by ${1}',
              (b) => b.player(target).player(perpetrator));
            return this.cb(false) ?? undefined;
          }),
      );
    }
    options.options.push(
      new SelectOption('Do not block', 'Do not block')
        .andThen(() => {
          return this.cb(true) ?? undefined;
        }),
    );
    return options;
  }
}
