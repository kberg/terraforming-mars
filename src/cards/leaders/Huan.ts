import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';

export class Huan extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.HUAN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L29',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.text('DISABLE').tradeFleet().megacredits(0).multiplier.asterix();
          b.br.br;
        }),
        description: 'All opponents cannot trade next generation. Gain X M€.',
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
    const game = player.game;
    player.addResource(Resources.MEGACREDITS, game.generation, {log: true});
    game.syndicatePirateRaider = player.id;

    game.log(
      'All players except ${0} may not trade next generation.',
      (b) => b.player(player)
    );

    this.isDisabled = true;
    return undefined;
  }
}
