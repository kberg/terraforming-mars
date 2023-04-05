import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Playwrights} from '../community/corporations/Playwrights';
import {ICard} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Viron} from '../venusNext/Viron';

export class ProjectInspection extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.PROJECT_INSPECTION,
      cost: 0,

      metadata: {
        cardNumber: 'X02',
        renderData: CardRenderer.builder((b) => {
          b.text('Use a card action that has been used this generation.', Size.SMALL, true);
        }),
      },
    });
  }
  private getActionCards(player: Player): Array<ICard> {
    const result: Array<ICard> = [];

    player.corporationCards.forEach((corp) => {
      if (player.getActionsThisGeneration().has(corp.name)) {
        if ((corp.name !== CardName.PLAYWRIGHTS || (corp as Playwrights).getCheckLoops() < 2) && (corp.name !== CardName.VIRON || (corp as Viron).getCheckLoops() < 2)) {
          if (corp.action !== undefined && corp.canAct !== undefined && corp.canAct(player)) {
            result.push(corp);
          }
        }
      }
    });

    for (const playedCard of player.playedCards) {
      if (playedCard.action !== undefined && playedCard.canAct !== undefined && playedCard.canAct(player) && player.getActionsThisGeneration().has(playedCard.name)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public canPlay(player: Player): boolean {
    return this.getActionCards(player).length > 0;
  }

  public play(player: Player) {
    const actionCards = this.getActionCards(player);
    if (actionCards.length === 0 ) {
      return undefined;
    }
    return new SelectCard(
      'Perform an action from a played card again',
      'Take action',
      actionCards,
      (foundCards: Array<ICard>) => {
        const foundCard = foundCards[0];
        player.game.log('${0} used ${1} action with ${2}', (b) => b.player(player).card(foundCard).card(this));
        return foundCard.action!(player);
      },
    );
  }
}
