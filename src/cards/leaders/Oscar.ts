import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Turmoil} from '../../turmoil/Turmoil';

export class Oscar extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.OSCAR,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L15',
        renderData: CardRenderer.builder((b) => {
          b.plus().influence(1);
          b.br.br;
          b.opgArrow().chairman();
        }),
        description: 'You have +1 influence. Once per game, replace the Chairman with one of your delegates from the reserve.',
      },
    });
  }

  public isDisabled = false;

  public play(player: Player) {
    const turmoil = player.game.turmoil;
    if (turmoil) turmoil.addInfluenceBonus(player);
    return undefined;
  }

  public canAct(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    return turmoil.hasAvailableDelegates(player.id) && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.delegateReserve.push(turmoil.chairman as string);
    turmoil.chairman = player.id;

    const index = turmoil.delegateReserve.indexOf(player.id);
    if (index > -1) turmoil.delegateReserve.splice(index, 1);
    this.isDisabled = true;

    return undefined;
  }
}
