import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';

export class Duncan extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.DUNCAN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L04',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().megacredits(4).multiplier.vpIcon().asterix();
          b.br;
        }),
        description: 'Once per game, gain 6-X VP and 4X M€, where X is the current generation number.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
   return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    player.addResource(Resources.MEGACREDITS, 4 * player.game.generation, {log: true});
    this.isDisabled = true;
    return undefined;
  }
}
