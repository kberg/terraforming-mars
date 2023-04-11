import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {AutomaHandler} from '../../automa/AutomaHandler';

export class GalileanWaystation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 15,
      tags: [Tags.SPACE],
      name: CardName.GALILEAN_WAYSTATION,
      cardType: CardType.AUTOMATED,

      metadata: {
        description: 'Increase your M€ production 1 step for every Jovian tag in play.',
        cardNumber: 'C13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().jovian().played.any);
        }),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    const game = player.game;
    let amount = game.getPlayers()
      .map((aplayer) => aplayer.getTagCount(Tags.JOVIAN, player.id === aplayer.id ? 'default' : 'raw'))
      .reduce((a, c) => a + c, 0);
    
    if (game.isSoloMode() && game.gameOptions.automaSoloVariant) {
      amount += AutomaHandler.getBotTagCount(game);
    }

    player.addProduction(Resources.MEGACREDITS, amount, {log: true});
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
