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
          b.tr(1).colon().megacredits(4).asterix();
          b.br;
        }),
        description: 'When you take an action that raises your terraform rating THIS GENERATION (max 10 times), gain 4 M€.',
      },
    });
  }

  public isDisabled = false;
  public opgActionIsActive = false;
  public effectTriggerCount = 0;

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
    if (this.effectTriggerCount === 10) return;

    this.effectTriggerCount++;
    const remainingUses = 10 - this.effectTriggerCount;

    player.game.log('${0} triggered ${1} effect (${2}/10 remaining)', (b) => b.player(player).card(this).number(remainingUses));
    player.addResource(Resources.MEGACREDITS, 4, {log: true});

    return undefined;
  }
}
