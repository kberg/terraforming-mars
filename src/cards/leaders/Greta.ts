import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';

export class Greta extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.GRETA,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L31',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.tr(1).colon().megacredits(4);
          b.br;
        }),
        description: 'When you take an action or gain a track bonus that raises your terraform rating THIS GENERATION, gain 4 M€.',
      },
    });
  }

  public isDisabled = false;
  public opgActionIsActive = false;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(): PlayerInput | undefined {
    this.opgActionIsActive = true;
    this.isDisabled = true;
    return undefined;
  }

  public onTRIncrease(player: Player) {
    if (this.opgActionIsActive === false) return;
    player.addResource(Resources.MEGACREDITS, 4, {log: true});
    return undefined;
  }
}
