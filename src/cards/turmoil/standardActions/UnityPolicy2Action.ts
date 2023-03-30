import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {UNITY_POLICY_2} from '../../../turmoil/parties/Unity';

export class UnityPolicy2Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.UNITY_POLICY_2_ACTION,
      metadata: {
        cardNumber: 'TA6',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(UNITY_POLICY_2.description, (eb) => {
            eb.megacredits(4).startAction.titanium(2).digit.slash().floaters(2).digit;
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return UNITY_POLICY_2.canAct(player);
  }

  public action(player: Player) {
    return UNITY_POLICY_2.action(player);
  }
}
