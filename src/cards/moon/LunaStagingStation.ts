import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class LunaStagingStation extends MoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.LUNA_STAGING_STATION,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 12,
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonLogistics: 2},

      requirements: CardRequirements.builder((b) => b.logisticRate(2)),
      metadata: {
        description: 'Requires Logistic Rate to be 2 or higher. Spend 1 titanium. Raise the Logistic Rate 2 steps.',
        cardNumber: 'M30',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.moonLogisticsRate({amount: 2});
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
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    super.play(player);
    MoonExpansion.raiseLogisticRate(player, 2);
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 2});
  }
}
