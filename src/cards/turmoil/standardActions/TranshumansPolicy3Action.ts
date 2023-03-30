import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {TRANSHUMANS_POLICY_3} from '../../../turmoil/parties/Transhumans';

export class TranshumansPolicy3Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.TRANSHUMANS_POLICY_3_ACTION,
      metadata: {
        cardNumber: 'TA15',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(TRANSHUMANS_POLICY_3.description, (eb) => {
            eb.megacredits(10).startAction.projectRequirements();
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return TRANSHUMANS_POLICY_3.canAct(player);
  }

  public action(player: Player) {
    return TRANSHUMANS_POLICY_3.action(player);
  }
}
