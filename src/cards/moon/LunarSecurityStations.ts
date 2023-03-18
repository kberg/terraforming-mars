import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Size} from '../render/Size';
import {IProjectCard} from '../IProjectCard';
import {CardRequirements} from '../CardRequirements';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class LunarSecurityStations extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.LUNAR_SECURITY_STATIONS,
      cardType: CardType.ACTIVE,
      cost: 9,
      tr: {moonLogistics: 1},
      requirements: CardRequirements.builder((b) => b.roadTiles(3).any()),

      metadata: {
        description: 'Requires 3 road tiles on the Moon. Raise the Logistic Rate 1 step.',
        cardNumber: 'M42',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your', Size.SMALL, true).br;
          b.steel(1).titanium(1).production((pb) => pb.steel(1).titanium(1)).br;
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
