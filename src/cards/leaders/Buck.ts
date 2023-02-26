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
import {BoardName} from '../../boards/BoardName';

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
        description: 'Once per game, take a played automated (green) card back into your hand. You may not take back a card that places a non-ocean tile on reserved spaces.',
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
    const disallowedCards = [
      CardName.PROTECTED_VALLEY,
      CardName.MOHOLE_AREA,
      CardName.MANGROVE,
      CardName.GANYMEDE_COLONY,
      CardName.PHOBOS_SPACE_HAVEN,
      // Venus and Promo,
      CardName.DAWN_CITY,
      CardName.LUNA_METROPOLIS,
      CardName.MAXWELL_BASE,
      CardName.STRATOPOLIS,
      CardName.STANFORD_TORUS,
      // Moon
      CardName.MARE_IMBRIUM_MINE,
      CardName.MARE_NECTARIS_MINE,
      CardName.MARE_NUBIUM_MINE,
      CardName.MARE_SERENITATIS_MINE,
    ];

    if (player.game.gameOptions.boardName !== BoardName.HELLAS) {
      disallowedCards.push(CardName.NOCTIS_CITY);
    }

    let targetCards = player.playedCards.filter((c) => c.cardType === CardType.AUTOMATED);
    targetCards = targetCards.filter((c) => !disallowedCards.includes(c.name));

    return targetCards;
  }
}
