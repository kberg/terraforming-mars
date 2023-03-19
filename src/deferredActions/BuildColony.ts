import {Player} from '../Player';
import {SelectColony} from '../inputs/SelectColony';
import {Colony} from '../colonies/Colony';
import {ColonyName} from '../colonies/ColonyName';
import {ColonyModel} from '../models/ColonyModel';
import {DeferredAction, Priority} from './DeferredAction';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';
import {RedsPolicy, ActionDetails} from '../turmoil/RedsPolicy';

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

    const redsAreRuling = PartyHooks.shouldApplyPolicy(this.player, PartyName.REDS);

    if (redsAreRuling) {
      const canAffordToBuildOnEuropaColony = RedsPolicy.canAffordRedsPolicy(this.player, this.player.game, new ActionDetails({oceansToPlace: 1}));
      if (canAffordToBuildOnEuropaColony.canAfford === false) {
        this.openColonies = this.openColonies.filter((c) => c.name !== ColonyName.EUROPA);
      } else {
        this.player.howToAffordReds = canAffordToBuildOnEuropaColony;
      }

      const canAffordToBuildOnVenusColony = RedsPolicy.canAffordRedsPolicy(this.player, this.player.game, new ActionDetails({venusIncrease: 1}));
      if (canAffordToBuildOnVenusColony.canAfford === false) this.openColonies = this.openColonies.filter((c) => c.name !== ColonyName.VENUS);

      const canAffordToBuildOnIapetusColony = RedsPolicy.canAffordRedsPolicy(this.player, this.player.game, new ActionDetails({TRIncrease: 1}));
      if (canAffordToBuildOnIapetusColony.canAfford === false) this.openColonies = this.openColonies.filter((c) => c.name !== ColonyName.IAPETUS);
    }

    if (this.openColonies.length === 0) return undefined;

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
