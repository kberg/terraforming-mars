import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {TRANSHUMANS_POLICY_2} from '../../../turmoil/parties/Transhumans';

export class TranshumansPolicy2Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.TRANSHUMANS_POLICY_2_ACTION,
      metadata: {
        cardNumber: 'TA14',
        renderData: CardRenderer.builder((b) =>
          b.standardProject(TRANSHUMANS_POLICY_2.description, (eb) => {
            eb.megacredits(10).startAction.influence(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return TRANSHUMANS_POLICY_2.canAct(player);
  }

  public action(player: Player) {
    return TRANSHUMANS_POLICY_2.action(player);
  }
}
