import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class Xavier extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.XAVIER,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L24',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.cards(1).secondaryTag(AltSecondaryTag.REQ).colon().megacredits(-1).asterix();
          b.br.br;
          b.opgArrow().text('GAIN').nbsp().wildTag(2).played.nbsp().asterix();
        }),
        description: 'Once per game, gain 2 wild tags for THIS GENERATION. Cards with requirements cost you 1 M€ less to play AFTER this action has been used.',
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

  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (this.isDisabled && card.requirements !== undefined) return 1;
    return 0;
  }
}
