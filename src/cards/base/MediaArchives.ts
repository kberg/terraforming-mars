import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {AutomaHandler} from '../../automa/AutomaHandler';

export class MediaArchives extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MEDIA_ARCHIVES,
      tags: [Tags.EARTH],
      cost: 8,

      metadata: {
        cardNumber: '107',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().event().played.any;
        }),
        description: 'Gain 1 M€ for each event EVER PLAYED by all players.',
      },
    });
  }

  public play(player: Player) {
    const game = player.game;
    let allPlayedEvents: number = game.getPlayers().map((player) => player.getPlayedEventsCount()).reduce((a, c) => a + c, 0);

    if (game.isSoloMode() && game.gameOptions.automaSoloVariant) {
      allPlayedEvents += AutomaHandler.getBotTagCount(game);
    }

    player.addResource(Resources.MEGACREDITS, allPlayedEvents, {log: true});
    return undefined;
  }
}
