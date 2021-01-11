import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class TundraFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TUNDRA_FARMING,
      tags: [Tags.PLANT],
      cost: 16,

      metadata: {
        cardNumber: '169',
        requirements: CardRequirements.builder((b) => b.temperature(-6)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) =>{
            pb.plants(1).megacredits(2);
          }).plants(1);
        }),
        description: 'Requires -6° C or warmer. Increase your Plant production 1 step and your MC production 2 steps. Gain 1 Plant.',
        victoryPoints: 2,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -6);
  }
  public play(player: Player) {
    player.addPlantProduction(1);
    player.addProduction(Resources.MEGACREDITS, 2);
    player.addPlants(1);
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
