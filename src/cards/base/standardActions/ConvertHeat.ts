import {StandardActionCard} from '../../StandardActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {HEAT_FOR_TEMPERATURE, MAX_TEMPERATURE} from '../../../constants';
import {Card} from '../../Card';
import {ActionDetails, RedsPolicy} from '../../../turmoil/RedsPolicy';

export class ConvertHeat extends StandardActionCard {
  constructor() {
    super({
      name: CardName.CONVERT_HEAT,
      tr: {temperature: 1},
      metadata: {
        cardNumber: 'SA2',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 8 Heat to raise temperature 1 step.', (eb) => {
            eb.heat(8).startAction.temperature(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this, false, 'take this action');

    if (player.game.getTemperature() === MAX_TEMPERATURE) {
      Card.setUselessActionWarningText(this, 'temperature is already maxed');
    }

    if (player.availableHeat < HEAT_FOR_TEMPERATURE) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      const actionDetails = new ActionDetails({temperatureIncrease: 1, reservedHeat: HEAT_FOR_TEMPERATURE});
      const howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);
      return howToAffordReds.canAfford;
    }

    return true;
  }

  public action(player: Player) {
    return player.spendHeat(HEAT_FOR_TEMPERATURE, () => {
      this.actionUsed(player);
      player.game.increaseTemperature(player, 1);
      return undefined;
    });
  }
}
