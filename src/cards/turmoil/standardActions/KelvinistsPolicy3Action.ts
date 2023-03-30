import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {KELVINISTS_POLICY_3} from '../../../turmoil/parties/Kelvinists';
import {Card} from '../../Card';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {ActionDetails, RedsPolicy} from '../../../turmoil/RedsPolicy';
import {MAX_TEMPERATURE} from '../../../constants';

export class KelvinistsPolicy3Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.KELVINISTS_POLICY_3_ACTION,
      tr: {temperature: 1},
      metadata: {
        cardNumber: 'TA3',
        renderData: CardRenderer.builder((b) =>
          b.standardProject(KELVINISTS_POLICY_3.description, (eb) => {
            eb.heat(6).startAction.temperature(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this, false, 'take this action');

    if (player.game.getTemperature() === MAX_TEMPERATURE) return false;
    if (player.availableHeat < 6) return false;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      const actionDetails = new ActionDetails({temperatureIncrease: 1, reservedHeat: 6});
      const howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);
      return howToAffordReds.canAfford;
    }

    return KELVINISTS_POLICY_3.canAct(player);
  }

  public action(player: Player) {
    return KELVINISTS_POLICY_3.action(player);
  }
}
