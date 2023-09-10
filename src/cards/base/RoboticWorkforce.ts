import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ICard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Units} from '../../Units';
import {PlayerInput} from '../../PlayerInput';

export class RoboticWorkforce extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ROBOTIC_WORKFORCE,
      tags: [Tags.SCIENCE],
      cost: 9,
      metadata: {
        cardNumber: '086',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy A', Size.SMALL, true).nbsp();
          b.production((pb) => pb.building().played);
        }),
        description: 'Duplicate only the production box of one of your building cards.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return RoboticWorkforce.getAvailableCards(player).length > 0;
  }

  public static isCardApplicable(card: ICard, player: Player, adjustment: Units): boolean {
    if (!card.tags.includes(Tags.BUILDING) && !card.tags.includes(Tags.WILDCARD)) {
      return false;
    }
    if (card.name === CardName.BIOMASS_COMBUSTORS) {
      return player.game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }
    if (card.name === CardName.HEAT_TRAPPERS) {
      return player.game.someoneHasResourceProduction(Resources.HEAT, 2);
    }

    if (card.name === CardName.GYROPOLIS) {
      return player.getProduction(Resources.ENERGY) >= 2;
    }

    if (card.produce !== undefined) return true;

    if (card.productionBox === undefined || card.productionBox === Units.EMPTY) return false;

    // Used by Cyberia Systems where a second card may become copyable due to production(s) gained from the first
    const productionBox = Units.adjustUnits(card.productionBox, adjustment);

    return player.canAdjustProduction(productionBox);
  }

  public static getAvailableCards(player: Player, adjustment: Units = Units.EMPTY): Array<ICard> {
    const availableCards: Array<ICard> = player.playedCards.filter((card) => RoboticWorkforce.isCardApplicable(card, player, adjustment));

    player.corporationCards.forEach((corp) => {
      if (RoboticWorkforce.isCardApplicable(corp, player, adjustment)) availableCards.push(corp);
    });

    return availableCards;
  }

  public play(player: Player) {
    const availableCards = RoboticWorkforce.getAvailableCards(player);
    return RoboticWorkforce.selectBuildingCard(player, availableCards, this.name, 'Select builder card to copy');
  }

  public static selectBuildingCard(player: Player, availableCards: ICard[], source: CardName, title: string, cb: (card: ICard) => PlayerInput | undefined = () => undefined) {
    if (availableCards.length === 0) return undefined;

    return new SelectCard(title, 'Copy', availableCards, (selectedCards: Array<ICard>) => {
      const card: ICard = selectedCards[0];
      player.game.log('${0} copied ${1} production with ${2}', (b) => b.player(player).card(card).cardName(source));

      if (card.produce) {
        card.produce(player);
      } else if (card.productionBox) {
        player.adjustProduction(card.productionBox);
      } else {
        throw new Error(`Card ${card.name} is not a valid Robotic Workforce card.`);
      }
      return cb(card);
    });
  }
}
