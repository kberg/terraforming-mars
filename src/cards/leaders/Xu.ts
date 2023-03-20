import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';

export class Xu extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.XU,
      cardType: CardType.LEADER,
      tags: [Tags.VENUS],
      metadata: {
        cardNumber: 'L37',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().venus(1).played.any.colon().megacredits(2).megacredits(6).asterix();
          b.br.br;
        }),
        description: 'Once per game, gain 2 M€ for each Venus tag all players have in play. Gain 6 M€ if you have the most Venus tags in play.',
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
    const players = player.game.getPlayers();
    const amount = players
      .map((p) => p.getTagCount(Tags.VENUS, player.id === p.id ? 'default' : 'raw'))
      .reduce((a, c) => a + c, 0);

    player.addResource(Resources.MEGACREDITS, amount * 2, {log: true});

    const allPlayerVenusTagCounts = players.map((p) => p.getTagCount(Tags.VENUS));

    if (Math.max(...allPlayerVenusTagCounts) === player.getTagCount(Tags.VENUS)) {
      player.addResource(Resources.MEGACREDITS, 6, {log: true});
    }

    this.isDisabled = true;
    return undefined;
  }
}
