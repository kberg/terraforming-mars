import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class RoverDriversUnion extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.ROVER_DRIVERS_UNION,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 16,
      requirements: CardRequirements.builder((b) => b.logisticRate(2)),
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Requires 2 Logistic Rate. Raise the Logistic Rate 1 step. Increase your M€ production 1 step per Logistic Rate.',
        cardNumber: 'M78',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate().br;
          b.production((pb) => pb.megacredits(1)).slash().moonLogisticsRate();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      MoonExpansion.raiseLogisticRate(player);
      player.addProduction(Resources.MEGACREDITS, moonData.logisticRate, {log: true});
    });
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1});
  }
}
