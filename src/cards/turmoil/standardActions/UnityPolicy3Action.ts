import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {UNITY_POLICY_3} from '../../../turmoil/parties/Unity';
import {Tags} from '../../Tags';

export class UnityPolicy3Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.UNITY_POLICY_3_ACTION,
      metadata: {
        cardNumber: 'TA7',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(UNITY_POLICY_3.description, (eb) => {
            eb.megacredits(4).startAction.cards(1).secondaryTag(Tags.SPACE);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return UNITY_POLICY_3.canAct(player);
  }

  public action(player: Player) {
    return UNITY_POLICY_3.action(player);
  }
}
