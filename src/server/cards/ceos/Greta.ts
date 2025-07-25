import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {Resource} from '../../../common/Resource';
import {Phase} from '../../../common/Phase';
import {ICeoCard} from './ICeoCard';

export class Greta extends CeoCard implements ICeoCard {
  constructor() {
    super({
      name: CardName.GRETA,
      metadata: {
        cardNumber: 'L31',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.tr(1).colon().megacredits(4).asterix();
          b.br;
        }),
        description: 'When you take an action or play a card that increases your TR THIS GENERATION (max 10 times), gain 4 M€.',
      },
    });
  }

  public data = {
    effectTriggerCount: 0,
  };

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }

  public onIncreaseTerraformRatingByAnyPlayer(cardOwner: IPlayer, player: IPlayer) {
    const game = player.game;
    if (this.opgActionIsActive === true && this.data.effectTriggerCount < 10) {
      if (player === cardOwner && game.phase === Phase.ACTION) {
        player.stock.add(Resource.MEGACREDITS, 4, {log: true, from: {card: this}});
        this.data.effectTriggerCount++;
      }
    }
    return undefined;
  }
}
