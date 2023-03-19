import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class VenusMagnetizer extends Card implements IActionCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.VENUS_MAGNETIZER,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.venus(10)),
      metadata: {
        cardNumber: '256',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your Energy production 1 step to raise Venus 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.venus(1);
          });
        }),
        description: 'Requires Venus 10%.',
      },
    });
  };

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const hasEnergyProduction = player.getProduction(Resources.ENERGY) > 0;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    const trGain = this.getTotalTRGain(player);
    Card.setRedsActionWarningText(player, trGain, this, redsAreRuling, 'raise Venus');

    if (!hasEnergyProduction) return false;
    if (venusMaxed) return true;

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
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
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }

  private getTotalTRGain(player: Player): number {
    const venusScale = player.game.getVenusScaleLevel();
    let trGain = venusScale === MAX_VENUS_SCALE ? 0 : 1;
    if (venusScale === 14) trGain += 1;

    return trGain;
  }

  public getActionDetails() {
    return new ActionDetails({venusIncrease: 1});
  }
}
