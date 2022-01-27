import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Size} from '../render/Size';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class Faraday extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.FARADAY,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L27',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.text('4', Size.LARGE).diverseTag(1, Size.MEDIUM).played.colon().cards(1).secondaryTag(AltSecondaryTag.DIVERSE);
          b.br.br;
        }),
        description: 'When you play a multiple of 4 of any tag type, draw a card with that tag. Wild tags do not count for this effect.',
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(): boolean {
   return false;
  }

  public action(): PlayerInput | undefined {
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.cardType === CardType.EVENT) return;

    const validTags =
      player.getAllTags()
      .filter((item) => [Tags.WILDCARD, Tags.EVENT].includes(item.tag) === false)
      .filter((item) => card.tags.includes(item.tag));

    validTags.forEach((item) => {
      const count = item.count;
      if (count % 4 === 0) player.drawCard(1, {tag: item.tag});
    })
  }
}
