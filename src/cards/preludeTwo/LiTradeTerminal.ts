import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Size} from '../render/Size';
import {LogHelper} from '../../LogHelper';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {RobotCard} from '../promo/SelfReplicatingRobots';

export class LiTradeTerminal extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.LI_TRADE_TERMINAL,
      tags: [Tags.SPACE],
      cost: 25,

      metadata: {
        cardNumber: '??',
        description: 'Add a resource to 3 different cards.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, first increase that Colony Tile track 2 steps.', (eb) => {
            eb.trade().startEffect.text('+2', Size.LARGE);
          });
          b.br;
          b.diverseResource(3).digit.nbsp().asterix();
        }),
        victoryPoints: 2,
      },
    });
  }

  public play(player: Player) {
    player.colonyTradeOffset += 2;

    const resourceCards = player.getResourceCards();
    const robotCards = player.getSelfReplicatingRobotsTargetCards();
    const targets = resourceCards.concat(robotCards.map((c) => c.card));
    const count = Math.min(targets.length, 3);

    if (targets.length === 0) return undefined;

    return new SelectCard(
      `Select up to ${count} cards to add resource`,
      'Add resources',
      targets,
      (foundCards: Array<ICard>) => {
        foundCards.forEach((card) => {
          const robotCard: RobotCard | undefined = robotCards.find((c) => c.card.name === card.name);

          if (robotCard) {
            robotCard.resourceCount++;
            LogHelper.logAddResource(player, robotCard.card);
          } else {
            player.addResourceTo(card, {log: true});
          }
        });

        return undefined;
      },
      {min: 1, max: count},
    );
  }

  public getVictoryPoints(): number {
    return 2;
  }

  public onDiscard(player: Player): void {
    player.colonyTradeOffset -= 2;
  }
}
