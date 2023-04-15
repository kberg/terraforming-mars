import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class TerraformingGanymede extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TERRAFORMING_GANYMEDE,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 33,

      metadata: {
        cardNumber: '197',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().jovian().played;
        }),
        description: 'Raise your TR 1 step for each Jovian tag you have, including this.',
        victoryPoints: 2,
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = this.getTRIncrease(player);
    // Set card warning if Reds are ruling, otherwise remove it
    Card.setRedsWarningText(player, PartyHooks.shouldApplyPolicy(player, PartyName.REDS) ? trGain : 0, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    const steps = 1 + player.getTagCount(Tags.JOVIAN);
    player.increaseTerraformRatingSteps(steps);
    LogHelper.logTRChange(player, steps);

    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, TRIncrease: this.getTRIncrease(player)});
  }

  private getTRIncrease(player: Player) {
    return 1 + player.getTagCount(Tags.JOVIAN);
  }
}
