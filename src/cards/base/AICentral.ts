import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IActionCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class AICentral extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.AI_CENTRAL,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 21,
      productionBox: {energy: -1},

      metadata: {
        description: {
          text: 'Requires 3 Science tags to play. Decrease your Energy production 1 step.',
          align: 'left',
        },
        cardNumber: '208',
        requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
        renderData: CardRenderer.builder((b) => {
          b.effect('Draw 2 cards.', (ab) => ab.empty().startAction.cards(2)).br;
          b.production((pb) => pb.minus().energy(1));
        }),
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 3 && Units.hasProduction(this.productionBox, player);
  }
  public play(player: Player) {
    player.adjustProductionUnits(this.productionBox);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public getVictoryPoints() {
    return 1;
  }
  public action(player: Player, game: Game) {
    player.drawCard(game, 2);
    return undefined;
  }
}
