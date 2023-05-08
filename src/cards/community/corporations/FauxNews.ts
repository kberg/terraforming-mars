import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Card} from '../../Card';
import {Player} from '../../../Player';
import {Size} from '../../render/Size';
import {Misinformation} from '../Misinformation';
import {Dealer} from '../../../Dealer';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectOption} from '../../../inputs/SelectOption';
import {Resources} from '../../../Resources';

export class FauxNews extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.FAUX_NEWS,
      initialActionText: 'Shuffle 10 Misinformation cards into the deck',
      startingMegaCredits: 40,

      metadata: {
        cardNumber: 'R60',
        description: 'You start with 46 M€. As your first action, shuffle 10 Misinformation into the deck.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(46).nbsp(Size.TINY).text('SHUFFLE 10', Size.SMALL).misinformation(1).asterix();
          b.corpBox('action', (ce) => {
            ce.vSpace();
            ce.action('Place a Misinformation in your hand and on top of the deck, or discard a Misinformation from your hand to gain 6 M€ and draw a card.', (eb) => {
              eb.empty().startAction.misinformation(1).slash().misinformation(1).colon().megacredits(6).cards(1).asterix();
            }).br;
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public initialAction(player: Player) {
    const game = player.game;
    const deck = game.dealer.deck;

    for (let i = 0; i < 10; i++) {
      deck.push(new Misinformation());
    }

    game.dealer.deck = Dealer.shuffle(deck);
    game.log('${0} shuffled 10 ${1} into the deck', (b) => b.player(player).cardName(CardName.MISINFORMATION));
    return undefined;
  }

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const game = player.game;
    const orOptions = new OrOptions();

    const playerHasMisinformation = player.cardsInHand.some((card) => card.name === CardName.MISINFORMATION);

    if (playerHasMisinformation) {
      orOptions.options.push(new SelectOption('Discard a Misinformation from your hand to gain 6 M€ and draw a card', 'Select', () => {
        const misinformation = player.cardsInHand.find((c) => c.name === CardName.MISINFORMATION)!;
        player.cardsInHand.splice(player.cardsInHand.indexOf(misinformation), 1);
        game.dealer.discard(misinformation);

        game.log('${0} discarded a ${1} from their hand to gain 6 M€ and draw a card', (b) => b.player(player).cardName(CardName.MISINFORMATION));
        player.addResource(Resources.MEGACREDITS, 6);
        player.drawCard();

        return undefined;
      }));
    }

    orOptions.options.push(new SelectOption('Place a Misinformation in your hand and on top of the deck', 'Select', () => {
      game.log('${0} added a ${1} to their hand and on top of the deck', (b) => b.player(player).cardName(CardName.MISINFORMATION));
      player.cardsInHand.push(new Misinformation());
      game.dealer.deck.push(new Misinformation());

      return undefined;
    }));

    if (orOptions.options.length === 1) return orOptions.options[0].cb();
    return orOptions;
  }
}
