import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {RobotCard} from '../promo/SelfReplicatingRobots';

export class CEOsFavoriteProject extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CEOS_FAVORITE_PROJECT,
      cost: 1,

      metadata: {
        cardNumber: '149',
        renderData: CardRenderer.builder((b) => b.text('Add 1 resource to a card with at least 1 resource on it', Size.SMALL, true)),
      },
    });
  }
  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    const cardsWithResources = player.getCardsWithResources();
    const robotCards = player.getSelfReplicatingRobotsTargetCards();
    const targets = cardsWithResources.concat(robotCards.map((c) => c.card));

    if (targets.length === 0) return undefined;

    return new SelectCard(
      'Select card to add resource',
      'Add resource',
      targets,
      (foundCards: Array<ICard>) => {
        // if the user selected a robot card, handle it here:
        const robotCard: RobotCard | undefined = robotCards.find((c) => c.card.name === foundCards[0].name);
        if (robotCard) {
          robotCard.resourceCount++;
          LogHelper.logAddResource(player, robotCard.card);
        } else {
          player.addResourceTo(foundCards[0], {log: true});
        }
        return undefined;
      },
    );
  }
}

