import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, RedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class CaretakerContract extends Card implements IActionCard, IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.CARETAKER_CONTRACT,
      cost: 3,
      requirements: CardRequirements.builder((b) => b.temperature(0)),
      metadata: {
        cardNumber: '154',
        description: 'Requires 0° C or warmer.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 8 heat to increase your terraform rating 1 step.', (eb) => {
            eb.heat(8).startAction.tr(1);
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    const hasEnoughHeat = player.availableHeat >= 8;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    Card.setRedsActionWarningText(player, 1, this, redsAreRuling);

    if (!hasEnoughHeat) return false;

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
    return player.spendHeat(8, () => {
      player.increaseTerraformRatingSteps(1);
      return undefined;
    });
  }

  public getActionDetails() {
    return new ActionDetails({TRIncrease: 1});
  }
}
