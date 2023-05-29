import {Player} from '../Player';
import {Resources} from '../Resources';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../CardName';
import {MonsInsuranceBot} from '../cards/automa/MonsInsuranceBot';

export class RemoveAnyPlants implements DeferredAction {
  public priority = Priority.ATTACK_OPPONENT;
  constructor(
        public player: Player,
        public count: number = 1,
        public title: string = 'Select player to remove up to ' + count + ' plants',
  ) {}

  public execute() {
    if (this.player.game.isSoloMode()) {
      // Crash site cleanup hook
      this.player.game.someoneHasRemovedOtherPlayersPlants = true;
      // Bentenmaru hook
      if (this.player.isCorporation(CardName.BENTENMARU)) {
        this.player.addResource(Resources.PLANTS, this.count, {log: true});
      }
      // Mons Insurance Bot hook
      if (this.player.game.automaBotCorporation?.name === CardName.MONS_INSURANCE_BOT) {
        MonsInsuranceBot.resolveMonsInsuranceBot(this.player);
      }

      return undefined;
    }

    const candidates = this.player.game.getPlayers().filter((p) => p.id !== this.player.id && !p.plantsAreProtected() && p.plants > 0);

    if (candidates.length === 0) {
      return undefined;
    }

    const removalOptions = candidates.map((candidate) => {
      const qtyToRemove = Math.min(candidate.plants, this.count);
      return new SelectOption('Remove ' + qtyToRemove + ' plants from ' + candidate.name, 'Remove plants', () => {
        candidate.deductResource(Resources.PLANTS, qtyToRemove, {log: true, from: this.player});
        return undefined;
      });
    });

    const orOptions = new OrOptions(
      ...removalOptions,
      new SelectOption('Skip removing plants', 'Confirm', () => {
        return undefined;
      }),
    );

    orOptions.title = this.title;
    return orOptions;
  }
}
