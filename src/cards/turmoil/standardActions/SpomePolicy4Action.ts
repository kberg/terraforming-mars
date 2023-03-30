import {TurmoilActionCard} from '../../TurmoilActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {SPOME_POLICY_4} from '../../../turmoil/parties/Spome';
import {AltSecondaryTag} from '../../render/CardRenderItem';

export class SpomePolicy4Action extends TurmoilActionCard {
  constructor() {
    super({
      name: CardName.SPOME_POLICY_4_ACTION,
      metadata: {
        cardNumber: 'TA10',
        renderData: CardRenderer.builder((b) =>
          b.br.standardProject(SPOME_POLICY_4.description, (eb) => {
            eb.megacredits(10).startAction.cards(2).secondaryTag(AltSecondaryTag.PLANETARY);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return SPOME_POLICY_4.canAct(player);
  }

  public action(player: Player) {
    return SPOME_POLICY_4.action(player);
  }
}
