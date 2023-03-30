import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {CENTRISTS_POLICY_3} from '../../../turmoil/parties/Centrists';
import {Size} from '../../render/Size';

export class CentristsPolicy3Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.CENTRISTS_POLICY_3_ACTION,
      metadata: {
        cardNumber: 'TA17',
        renderData: CardRenderer.builder((b) =>
          b.standardProject(CENTRISTS_POLICY_3.description, (eb) => {
            eb.nbsp(Size.TINY).startAction.trade();
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return CENTRISTS_POLICY_3.canAct(player);
  }

  public action(player: Player) {
    return CENTRISTS_POLICY_3.action(player);
  }
}
