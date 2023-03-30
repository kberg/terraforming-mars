import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {KELVINISTS_DEFAULT_POLICY} from '../../../turmoil/parties/Kelvinists';

export class KelvinistsDefaultAction extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.KELVINISTS_DEFAULT_ACTION,
      metadata: {
        cardNumber: 'TA2',
        renderData: CardRenderer.builder((b) =>
          b.standardProject(KELVINISTS_DEFAULT_POLICY.description, (eb) => {
            eb.megacredits(10).startAction.production((pb) => pb.energy(1).heat(1));
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return KELVINISTS_DEFAULT_POLICY.canAct(player);
  }

  public action(player: Player) {
    return KELVINISTS_DEFAULT_POLICY.action(player);
  }
}
