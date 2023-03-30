import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {POPULISTS_POLICY_3} from '../../../turmoil/parties/Populists';

export class PopulistsPolicy3Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.POPULISTS_POLICY_3_ACTION,
      metadata: {
        cardNumber: 'TA13',
        renderData: CardRenderer.builder((b) =>
          b.standardProject(POPULISTS_POLICY_3.description, (eb) => {
            eb.tr(1).startAction.cards(2).asterix();
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return POPULISTS_POLICY_3.canAct(player);
  }

  public action(player: Player) {
    return POPULISTS_POLICY_3.action(player);
  }
}
