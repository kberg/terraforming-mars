import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {Units} from '../../Units';
import {Size} from '../render/Size';
import {MoonCard} from './MoonCard';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class SmallDutyRovers extends MoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.SMALL_DUTY_ROVERS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 9,
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonLogistics: 1},

      metadata: {
        description: 'Spend 1 titanium. Raise the Logistic Rate 1 step. Gain 1 M€ per colony tile, mine tile and road tile on the Moon.',
        cardNumber: 'M73',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonLogisticsRate().br;
          b.megacredits(1).slash()
            .moonColony({size: Size.SMALL}).any
            .moonMine({size: Size.SMALL}).any
            .moonRoad({size: Size.SMALL}).any;
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (!super.canPlay(player)) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    this.howToAffordReds = undefined;
    return true;
  }

  public play(player: Player) {
    super.play(player);

    MoonExpansion.raiseLogisticRate(player);
    const gain = this.computeBonus(player);
    player.addResource(Resources.MEGACREDITS, gain, {log: true});

    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1, bonusMegaCredits: this.computeBonus(player)});
  }

  private computeBonus(player: Player): number {
    const moonData = MoonExpansion.moonData(player.game);
    const gain = moonData.moon.spaces.filter((s) => s.tile !== undefined && s.spaceType !== SpaceType.COLONY).length;

    return gain;
  }
}
