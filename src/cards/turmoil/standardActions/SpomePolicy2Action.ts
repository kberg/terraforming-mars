import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {SPOME_POLICY_2} from '../../../turmoil/parties/Spome';

export class SpomePolicy2Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.SPOME_POLICY_2_ACTION,
      metadata: {
        cardNumber: 'TA9',
        renderData: CardRenderer.builder((b) =>
          b.standardProject(SPOME_POLICY_2.description, (eb) => {
            eb.megacredits(10).startAction.tradeFleet();
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return SPOME_POLICY_2.canAct(player);
  }

  public action(player: Player) {
    return SPOME_POLICY_2.action(player);
  }
}
