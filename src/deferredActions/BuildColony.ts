import {Player} from '../Player';
import {SelectColony} from '../inputs/SelectColony';
import {Colony} from '../colonies/Colony';
import {ColonyName} from '../colonies/ColonyName';
import {ColonyModel} from '../models/ColonyModel';
import {DeferredAction, Priority} from './DeferredAction';
import {REDS_RULING_POLICY_COST} from '../constants';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';

export class BuildColony implements DeferredAction {
  public priority = Priority.BUILD_COLONY;
  constructor(
    public player: Player,
    public allowDuplicate: boolean = false,
    public title: string = 'Select where to build a colony',
    public openColonies?: Array<Colony>,
  ) {}

  public execute() {
    if (this.openColonies === undefined) {
      if (this.allowDuplicate) {
        this.openColonies = this.player.game.colonies.filter((colony) => colony.isActive && colony.colonies.length < 3);
      } else {
        this.openColonies = this.player.game.colonies.filter((colony) => colony.isActive && colony.colonies.includes(this.player.id) === false);
      }

      if (this.player.game.gameOptions.equalOpportunityVariant === false) {
        this.openColonies = this.openColonies.filter((colony) => colony.colonies.length < 3);
      }
    }

    if (this.openColonies.length === 0) {
      return undefined;
    }

    // TODO: Europa sometimes costs additional 3.
    if (PartyHooks.shouldApplyPolicy(this.player, PartyName.REDS) && !this.player.canAfford(REDS_RULING_POLICY_COST)) {
      this.openColonies = this.openColonies.filter((colony) => [ColonyName.VENUS, ColonyName.IAPETUS].includes(colony.name) === false);
    }

    const openColonies = this.openColonies;
    const coloniesModel: Array<ColonyModel> = this.player.game.getColoniesModel(openColonies);

    return new SelectColony(this.title, 'Build', coloniesModel, (colonyName: ColonyName) => {
      openColonies.forEach((colony) => {
        if (colony.name === colonyName) {
          colony.addColony(this.player);
        }
        return undefined;
      });
      return undefined;
    });
  }
}
