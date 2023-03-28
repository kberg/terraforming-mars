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
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class Faraday extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.FARADAY,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L27',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.text('5', Size.LARGE).diverseTag(1, Size.MEDIUM).played.colon().megacredits(-3).cards(1).secondaryTag(AltSecondaryTag.DIVERSE).asterix();
          b.br.br;
        }),
        description: 'When you gain a multiple of 5 for any tag type IN PLAY, you may pay 3 M€ to draw a card with that tag. Wild tags do not count for this effect.',
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
    if (!player.canAfford(3)) return;

    const validTags =
      player.getAllTags()
      .filter((item) => [Tags.WILDCARD, Tags.EVENT].includes(item.tag) === false)
      .filter((item) => card.tags.includes(item.tag));

    validTags.forEach((item) => {
      const count = item.count;
      const tagsAdded = card.tags.filter((tag) => tag === item.tag).length;

      if (count % 5 === 0) {
        player.game.defer(new DeferredAction(player, () => this.effectOptions(player, item.tag)));
      } else if (tagsAdded > 1 && (count - 1) % 5 === 0) {
        player.game.defer(new DeferredAction(player, () => this.effectOptions(player, item.tag)));
      }
    })
  }

  public effectOptions(player: Player, tag: Tags) {
    return new OrOptions(
      new SelectOption(`Pay 3 M€ to draw a ${tag} card`, 'Confirm', () => {
        player.game.defer(new SelectHowToPayDeferred(player, 3, {title: 'Select how to pay for card'}));
        player.drawCard(1, {tag: tag})
        return undefined;
      }),
      new SelectOption('Do nothing', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
