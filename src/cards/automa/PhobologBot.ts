import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Size} from '../render/Size';
import {Tags} from '../Tags';

export class PhobologBot extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.PHOBOLOG_BOT,
      startingMegaCredits: 0,

      metadata: {
        cardNumber: 'AU12',
        renderData: CardRenderer.builder((b) => {
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.vSpace(Size.LARGE);
            ce.action('Reveal and discard 2 space cards. Gain 1 TR for each tag on the card with more tags.', (eb) => {
              eb.cards(2).secondaryTag(Tags.SPACE).startAction.diverseTag().nbsp(Size.TINY).colon().tr(1, Size.SMALL).asterix();
            });
            ce.vSpace(Size.LARGE);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public initialAction() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    const drawnCards = game.dealer.drawProjectCardsByCondition(game, 2, (card) => card.tags.includes(Tags.SPACE));
    const tagCount = Math.max(drawnCards[0].tags.length, drawnCards[1].tags.length);

    game.automaBotVictoryPointsBreakdown.terraformRating += tagCount;
    game.log('${0} action: Reveal and discard ${1} and ${2} to gain ${3} TR.', (b) => b.card(this).card(drawnCards[0]).card(drawnCards[1]).number(tagCount));

    // Discard both cards
    game.dealer.discard(drawnCards[0]);
    game.dealer.discard(drawnCards[1]);

    return undefined;
  }
}
