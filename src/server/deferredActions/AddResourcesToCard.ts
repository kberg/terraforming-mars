import {IPlayer} from '../IPlayer';
import {SelectCard} from '../inputs/SelectCard';
import {CardResource} from '../../common/CardResource';
import {ICard} from '../cards/ICard';
import {Tag} from '../../common/cards/Tag';
import {DeferredAction, Priority} from './DeferredAction';
import {RobotCard} from '../cards/promo/SelfReplicatingRobots';
import {LogHelper} from '../LogHelper';
import {Message} from '../../common/logs/Message';
import {newMessage} from '../logs/MessageBuilder';
import {OneOrArray} from '../../common/utils/types';

export type Options = {
  count?: number;
  restrictedTag?: Tag;
  min?: number;
  title?: string | Message;
  robotCards?: boolean;
  autoSelect?: boolean;
  filter?(card: ICard): boolean;
  log?(): void;
}

export class AddResourcesToCard extends DeferredAction {
  constructor(
    player: IPlayer,
    /** The card type to add to. Undefined means any resource. */
    public resourceType: OneOrArray<CardResource> | undefined,
    public options: Options = {},
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  private getCardsInPlay(): Array<ICard> {
    let cards = this.player.getResourceCards(this.resourceType);
    const restrictedTag = this.options.restrictedTag;
    if (restrictedTag !== undefined) {
      cards = cards.filter((card) => card.tags.includes(restrictedTag));
    }
    if (this.options.filter !== undefined) {
      cards = cards.filter(this.options.filter);
    }
    const min = this.options.min;
    if (min) {
      cards = cards.filter((c) => c.resourceCount >= min);
    }
    return cards;
  }

  private getSelfReplicatingRobotCards(): Array<RobotCard> {
    if (this.options.robotCards !== true) {
      return [];
    }
    let cards = this.player.getSelfReplicatingRobotsTargetCards();
    if (this.options.restrictedTag !== undefined) {
      throw new Error('restrictedTag does not work when filtering SRR cards');
    }
    if (this.options.filter !== undefined) {
      throw new Error('Filter does not work when filtering SRR cards');
    }
    if (this.options.min) {
      const min = this.options.min;
      cards = cards.filter((c) => c.resourceCount >= min);
    }
    return cards;
  }

  /**
   * Returns the cards this deferredAction could apply to. Does not cache results.
   *
   * This is made public because of `Executor.canExecute` and should probably be someplace else.
   */
  public getCardCount(): number {
    return this.getCardsInPlay().length + this.getSelfReplicatingRobotCards().length;
  }

  public getCards(): [Array<ICard>, Array<RobotCard>] {
    return [this.getCardsInPlay(), this.getSelfReplicatingRobotCards()];
  }

  public execute() {
    const count = this.options.count ?? 1;

    const cards = this.getCardsInPlay();
    const robotCards = this.options.robotCards === true? this.getSelfReplicatingRobotCards() : [];

    if (robotCards.length === 0) {
      if (cards.length === 0) {
        return undefined;
      }

      if (cards.length === 1 && this.options.autoSelect === true) {
        this.addResource(cards[0], count);
        return undefined;
      }
    }

    let title = this.options.title;
    if (title === undefined) {
      const resourceType = this.resourceType;
      if (resourceType === undefined || Array.isArray(resourceType)) {
        title = newMessage('Select card to add ${0} ${1}', (b) => b.number(count).string('resources'));
      } else {
        title = newMessage('Select card to add ${0} ${1}', (b) => b.number(count).string(resourceType));
      }
    }

    const selectableCards = cards.concat(robotCards.map((c) => c.card));
    return new SelectCard(
      title,
      count === 1 ? 'Add resource' : 'Add resources',
      selectableCards)
      .andThen(([card]) => {
        const robotCard: RobotCard | undefined = robotCards.find((c) => c.card.name === card.name);
        if (robotCard) {
          robotCard.resourceCount++;
          LogHelper.logAddResource(this.player, robotCard.card);
        } else {
          this.addResource(card, count);
        }
        return undefined;
      });
  }

  private addResource(card: ICard, qty: number) {
    const autoLog = this.options.log === undefined;
    this.player.addResourceTo(card, {qty, log: autoLog});
    this.options.log?.();
  }
}
