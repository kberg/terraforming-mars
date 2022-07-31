import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Size} from '../../render/Size';
import {Card} from '../../Card';
import {Tags} from '../../Tags';
import {IProjectCard} from '../../IProjectCard';
import {DeferredAction} from '../../../deferredActions/DeferredAction';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectOption} from '../../../inputs/SelectOption';
import {AltSecondaryTag} from '../../render/CardRenderItem';

export class MaraboutShiritori extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MARABOUT_SHIRITORI,
      tags: [Tags.WILDCARD],
      startingMegaCredits: 37,
      initialActionText: 'Draw a card with a tag of your choice',

      metadata: {
        cardNumber: 'R56',
        description: 'You start with 37 M€. As your first action, name a tag. Draw a card with that tag.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(37).cards(1).secondaryTag(AltSecondaryTag.DIVERSE).asterix();

          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('The next card you play costs 3 M€ less if it shares a tag with the last project card you played this generation.', (eb) => {
              eb.diverseTag(1).played.equals().nbsp(Size.SMALL).text('LAST', Size.SMALL).nbsp(Size.SMALL).diverseTag(1).played.startEffect;
              eb.megacredits(-3).asterix();
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    const game = player.game;
    const tags = game.getAllValidTags();

    const options = tags.map((tag) => {
      return new SelectOption('Draw 1 ' + tag + ' card', 'Select', () => {
        player.drawCard(1, {tag: tag});
        return undefined;
      });
    });

    game.defer(new DeferredAction(player, () => new OrOptions(...options)));

    return undefined;
  }

  public getCardDiscount(player: Player, card: IProjectCard) {
    if (player.lastCardPlayed === undefined) return 0;

    const tagsOnLastCardPlayed = player.lastCardPlayed.tags;
    if (tagsOnLastCardPlayed.includes(Tags.WILDCARD)) return 3;
    if (card.tags.some((tag) => tagsOnLastCardPlayed.includes(tag))) return 3;

    return 0;
  }
}
