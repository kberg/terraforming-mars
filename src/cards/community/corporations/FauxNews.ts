import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Card} from '../../Card';
import {Player} from '../../../Player';
import {Size} from '../../render/Size';
import {Dealer} from '../../../Dealer';
import {Resources} from '../../../Resources';
import {MISINFORMATION_CARDS} from '../CommunityCardManifest';
import {CardFinder} from '../../../CardFinder';
import {IProjectCard} from '../../IProjectCard';
import {DeferredAction} from '../../../deferredActions/DeferredAction';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectOption} from '../../../inputs/SelectOption';

export class FauxNews extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.FAUX_NEWS,
      initialActionText: 'Shuffle Misinformation into the deck',
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'R60',
        description: 'You start with 40 M€. As your first action, shuffle a Misinformation into the deck for every 8 cards in the deck (max 60).',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(40).nbsp(Size.TINY).text('SHUFFLE ?', Size.SMALL).misinformation(1).asterix();
          b.corpBox('effect', (ce) => {
            ce.vSpace();
            ce.effect('When any Misinformation card is played, THAT PLAYER gains 3 M€, and you gain 3 M€ OR draw a card.', (eb) => {
              eb.misinformation(1).any.startEffect.megacredits(3).any.nbsp(Size.SMALL).plus().nbsp(Size.TINY).megacredits(3).slash().cards(1).asterix();
            });
          });
        }),
      },
    });
  }

  public initialAction(player: Player) {
    const game = player.game;
    const deck = game.dealer.deck;
    const cardFinder = new CardFinder();
    const count = Math.min(Math.ceil(deck.length / 8), 60);

    for (let i = 0; i < count; i++) {
      const card = cardFinder.getProjectCardByName(MISINFORMATION_CARDS[i])!;
      deck.push(card);
    }

    game.dealer.deck = Dealer.shuffle(deck);
    game.log('${0} shuffled ${1} ${2} into the deck', (b) => b.player(player).number(count).cardName(CardName.MISINFORMATION_1));
    return undefined;
  }

  public play() {
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    const megacreditsGain = 3;
    const fauxNewsOwner = player.game.getCardPlayer(this.name);

    if (MISINFORMATION_CARDS.includes(card.name)) {
      player.addResource(Resources.MEGACREDITS, megacreditsGain, {log: true});

      const orOptions = new OrOptions(
        new SelectOption('Gain 3 M€', 'Select', () => {
          fauxNewsOwner.addResource(Resources.MEGACREDITS, megacreditsGain, {log: true});
          return undefined;
        }),
        new SelectOption('Draw a card', 'Select', () => {
          fauxNewsOwner.drawCard(1);
          return undefined;
        }),
      );

      if (fauxNewsOwner.hasConceded) {
        orOptions.options[0].cb();
        return undefined;
      }

      player.game.defer(new DeferredAction(fauxNewsOwner, () => {
        return orOptions;
      }));
    }

    return undefined;
  }
}
