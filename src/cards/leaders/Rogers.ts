import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {GlobalParameter} from '../../GlobalParameter';

export class Rogers extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.ROGERS,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L18',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.venus(1).played.colon().megacredits(-3);
          b.br.br;
          b.venus(1).played.colon().nbsp.projectRequirements();
          b.br;
        }),
        description: 'Ignore global requirements for your Venus cards THIS GENERATION. When you play a Venus tag THIS GENERATION, you pay 3 M€ less for it.',
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

  public getRequirementBonus(_player: Player, parameter: GlobalParameter): number {
    if (parameter !== GlobalParameter.VENUS) return 0;
    if (this.opgActionIsActive === false) return 0;

    // Magic number high enough to always ignore requirements.
    return 50;
  }

  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (this.opgActionIsActive === false) return 0;
    return card.tags.filter((tag) => tag === Tags.VENUS).length * 3;
  }
}