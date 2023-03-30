import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {MARS_FIRST_POLICY_4} from '../../../turmoil/parties/MarsFirst';
import {Tags} from '../../Tags';

export class MarsFirstPolicy4Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.MARS_FIRST_POLICY_4_ACTION,
      metadata: {
        cardNumber: 'TA5',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(MARS_FIRST_POLICY_4.description, (eb) => {
            eb.megacredits(4).startAction.cards(1).secondaryTag(Tags.BUILDING);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return MARS_FIRST_POLICY_4.canAct(player);
  }

  public action(player: Player) {
    return MARS_FIRST_POLICY_4.action(player);
  }
}
