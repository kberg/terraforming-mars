import {Card} from '../Card';
import {CardName} from '../../CardName';
import {ShiftAresGlobalParametersDeferred} from '../../deferredActions/ShiftAresGlobalParametersDeferred';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {AresHandler} from '../../ares/AresHandler';
import {HAZARD_CONSTRAINTS} from '../../ares/IAresData';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class ButterflyEffect extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BUTTERFLY_EFFECT,
      cost: 8,
      tr: {tr: 1},

      metadata: {
        cardNumber: 'A03',
        description: 'Gain 1 TR. Move each individual hazard marker up to 1 step up or down.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.plate('All hazard markers').colon().text('-1 / 0 / +1', Size.SMALL);
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (!super.canPlay(player)) return false;

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
    player.increaseTerraformRatingSteps(1);

    AresHandler.ifAres(player.game, (aresData) => {
      const hazardData = aresData.hazardData;

      if (HAZARD_CONSTRAINTS.some((constraint) => hazardData[constraint].available === true)) {
        player.game.defer(new ShiftAresGlobalParametersDeferred(player));
      } else {
        player.game.log('All hazard markers have already been reached.');
      }
    });

    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, TRIncrease: 1});
  }
}
