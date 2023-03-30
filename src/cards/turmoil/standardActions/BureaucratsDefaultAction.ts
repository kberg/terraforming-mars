import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {BUREAUCRATS_DEFAULT_POLICY} from '../../../turmoil/parties/Bureaucrats';

export class BureaucratsDefaultAction extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.BUREAUCRATS_DEFAULT_ACTION,
      metadata: {
        cardNumber: 'TA12',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(BUREAUCRATS_DEFAULT_POLICY.description, (eb) => {
            eb.megacredits(3).startAction.delegates(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return BUREAUCRATS_DEFAULT_POLICY.canAct(player);
  }

  public action(player: Player) {
    return BUREAUCRATS_DEFAULT_POLICY.action(player);
  }
}
