import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {REDS_POLICY_3} from '../../../turmoil/parties/Reds';
import {Size} from '../../render/Size';

export class RedsPolicy3Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.REDS_POLICY_3_ACTION,
      metadata: {
        cardNumber: 'TA8',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(REDS_POLICY_3.description, (eb) => {
            eb.megacredits(4).startAction.temperature(1, Size.SMALL).any.slash(Size.SMALL).oxygen(1, Size.SMALL).any.slash(Size.SMALL).oceans(1, Size.SMALL).any;
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return REDS_POLICY_3.canAct(player);
  }

  public action(player: Player) {
    return REDS_POLICY_3.action(player);
  }
}
