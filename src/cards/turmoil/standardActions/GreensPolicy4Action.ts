import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {GREENS_POLICY_4} from '../../../turmoil/parties/Greens';

export class GreensPolicy4Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.GREENS_POLICY_4_ACTION,
      metadata: {
        cardNumber: 'TA4',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(GREENS_POLICY_4.description, (eb) => {
            eb.megacredits(5).startAction.plants(3).digit.slash().microbes(2).digit;
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return GREENS_POLICY_4.canAct(player);
  }

  public action(player: Player) {
    return GREENS_POLICY_4.action(player);
  }
}
