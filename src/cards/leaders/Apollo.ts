import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';

export class Apollo extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.APOLLO,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L35',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.moonColony().any.moonMine().any.moonRoad().any.nbsp().colon().megacredits(3);
          b.br.br;
        }),
        description: 'Once per game, gain 3 M€ for each tile on The Moon.',
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
    const moonSpacesCount = MoonExpansion.tiles(player.game).length;
    player.addResource(Resources.MEGACREDITS, moonSpacesCount * 3, {log: true});
    this.isDisabled = true;
    return undefined;
  }
}
