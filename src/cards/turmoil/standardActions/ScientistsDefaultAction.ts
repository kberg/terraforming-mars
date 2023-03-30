import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {SCIENTISTS_DEFAULT_POLICY} from '../../../turmoil/parties/Scientists';

export class ScientistsDefaultAction extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.SCIENTISTS_DEFAULT_ACTION,
      metadata: {
        cardNumber: 'TA1',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(SCIENTISTS_DEFAULT_POLICY.description, (eb) => {
            eb.megacredits(10).startAction.cards(3);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return SCIENTISTS_DEFAULT_POLICY.canAct(player);
  }

  public action(player: Player) {
    return SCIENTISTS_DEFAULT_POLICY.action(player);
  }
}
