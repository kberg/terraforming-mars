import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {BUREAUCRATS_POLICY_3} from '../../../turmoil/parties/Bureaucrats';

export class BureaucratsPolicy3Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.BUREAUCRATS_POLICY_3_ACTION,
      metadata: {
        cardNumber: 'TA18',
        renderData: CardRenderer.builder((b) =>
          b.standardProject(BUREAUCRATS_POLICY_3.description, (eb) => {
            eb.megacredits(3).startAction.landClaimTile(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return BUREAUCRATS_POLICY_3.canAct(player);
  }

  public action(player: Player) {
    return BUREAUCRATS_POLICY_3.action(player);
  }
}
