import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class EquatorialMagnetizer extends Card implements IActionCard, IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EQUATORIAL_MAGNETIZER,
      tags: [Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '015',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your Energy production 1 step to increase your terraform rating 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.tr(1);
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 1;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    Card.setRedsActionWarningText(1, this, redsAreRuling);

    if (!hasEnergyProduction) return false;

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails();
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }
  public action(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.increaseTerraformRatingSteps(1);
    return undefined;
  }

  public getActionDetails() {
    return new ActionDetails({TRIncrease: 1});
  }
}

