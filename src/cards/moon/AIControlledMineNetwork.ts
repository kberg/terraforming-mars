import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class AIControlledMineNetwork extends Card {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.AI_CONTROLLED_MINE_NETWORK,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SCIENCE],
      cost: 6,
      tr: {moonLogistics: 1},

      requirements: CardRequirements.builder((b) => b.logisticRate(2)),
      metadata: {
        description: 'Requires Logistic Rate to be 2 or higher. Raise the Logistic Rate 1 step',
        cardNumber: 'M32',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate();
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
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
  
  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1});
  }
}
