import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {HowToAffordRedsPolicy, RedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';

export class DeepWellHeating extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DEEP_WELL_HEATING,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 13,
      tr: {temperature: 1},
      productionBox: Units.of({energy: 1}),

      metadata: {
        cardNumber: '003',
        description: 'Increase your Energy production 1 step. Increase temperature 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).temperature(1);
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    } else {
      return true;
    }
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    return player.game.increaseTemperature(player, 1);
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, temperatureIncrease: 1});
  }
}
