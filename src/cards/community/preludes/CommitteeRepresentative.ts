import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {SendDelegateToArea} from '../../../deferredActions/SendDelegateToArea';
import {Vitor} from '../../prelude/Vitor';
import {DeferredAction} from '../../../deferredActions/DeferredAction';

export class CommitteeRepresentative extends PreludeCard {
  constructor() {
    super({
      name: CardName.COMMITTEE_REPRESENTATIVE,
      metadata: {
        cardNumber: 'Y35',
        renderData: CardRenderer.builder((b) => {
          b.tr(2).delegates(1).br.br;
          b.award().br;
        }),
        description: 'Raise your TR 2 steps. Place a delegate, and fund an award for free.',
      },
    });
  }
  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    player.game.defer(new SendDelegateToArea(player, 'Select where to send delegate', {count: 1, source: 'reserve'}));
    player.game.defer(new DeferredAction(player, () => Vitor.fundAwardForFree(player)));

    return undefined;
  };
}

