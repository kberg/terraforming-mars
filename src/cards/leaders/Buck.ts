import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Size} from '../render/Size';

export class Buck extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.BUCK,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L36',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('TAKE BACK', Size.SMALL).cards(1).secondaryTag(AltSecondaryTag.GREEN).asterix();
          b.br;
        }),
        description: 'Once per game, take a played automated (green) card back into your hand. You may not take back a card that places a non-ocean tile on ocean spaces.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const targetCards = this.getAvailableCards(player);
    return this.isDisabled === false && targetCards.length > 0;
  }

  public action(player: Player): PlayerInput | undefined {
    return new SelectCard(
      'Select card to take back into hand',
      'Select',
      this.getAvailableCards(player),
      (foundCards: Array<IProjectCard>) => {
        const selectedCard = player.playedCards.splice(player.playedCards.indexOf(foundCards[0]), 1)[0];
        player.cardsInHand.push(selectedCard);
        this.isDisabled = true;
        return undefined;
      },
    );
  }

  private getAvailableCards(player: Player): IProjectCard[] {
    const disallowedCards = [CardName.PROTECTED_VALLEY, CardName.MOHOLE_AREA, CardName.MANGROVE];
    let targetCards = player.playedCards.filter((c) => c.cardType === CardType.AUTOMATED);
    targetCards = targetCards.filter((c) => !disallowedCards.includes(c.name));

    return targetCards;
  }
}
