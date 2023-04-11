import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AutomaHandler} from '../../automa/AutomaHandler';

export class TollStation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TOLL_STATION,
      tags: [Tags.SPACE],
      cost: 12,

      metadata: {
        cardNumber: '099',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().space().played.any.asterix();
          });
        }),
        description: 'Increase your M€ production 1 step for each space tag your OPPONENTS have.',
      },
    });
  }
  public play(player: Player) {
    const game = player.game;

    if (game.isSoloMode() && game.gameOptions.automaSoloVariant) {
      player.addProduction(Resources.MEGACREDITS, AutomaHandler.getBotTagCount(game), {log: true});
      return undefined;
    }

    const amount = game.getPlayers()
      .filter((aPlayer) => aPlayer !== player)
      .map((opponent) => opponent.getTagCount(Tags.SPACE, 'raw'))
      .reduce((a, c) => a + c, 0);

    player.addProduction(Resources.MEGACREDITS, amount, {log: true});
    return undefined;
  }
}
