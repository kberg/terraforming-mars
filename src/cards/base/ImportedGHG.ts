import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ImportedGHG extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_GHG,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 7,

      metadata: {
        cardNumber: '162',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(1)).heat(3);
        }),
        description: 'Increase your heat production 1 step and gain 3 heat.',
      },
    });
  }

  public play(player: Player, _game: Game) {
    player.addHeatProduction(1);
    player.addHeat(3);
    return undefined;
  }
}

