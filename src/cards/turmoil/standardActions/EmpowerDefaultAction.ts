import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {EMPOWER_DEFAULT_POLICY} from '../../../turmoil/parties/Empower';
import {Size} from '../../render/Size';

export class EmpowerDefaultAction extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.EMPOWER_DEFAULT_ACTION,
      metadata: {
        cardNumber: 'TA11',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(EMPOWER_DEFAULT_POLICY.description, (eb) => {
            eb.megacredits(0).multiplier.startAction.text('X').nbsp(Size.TINY).energy(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return EMPOWER_DEFAULT_POLICY.canAct(player);
  }

  public action(player: Player) {
    return EMPOWER_DEFAULT_POLICY.action(player);
  }
}
