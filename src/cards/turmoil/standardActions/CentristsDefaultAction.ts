import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {CENTRISTS_DEFAULT_POLICY} from '../../../turmoil/parties/Centrists';
import {Size} from '../../render/Size';

export class CentristsDefaultAction extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.CENTRISTS_DEFAULT_ACTION,
      metadata: {
        cardNumber: 'TA16',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(CENTRISTS_DEFAULT_POLICY.description, (eb) => {
            eb.nbsp(Size.TINY).startAction.megacredits(6);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return CENTRISTS_DEFAULT_POLICY.canAct(player);
  }

  public action(player: Player) {
    return CENTRISTS_DEFAULT_POLICY.action(player);
  }
}
