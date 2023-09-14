import {Player} from '../../Player';
import {CorporationCard} from '../corporation/CorporationCard';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';

export class Ecotec extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ECOTEC,
      tags: [Tags.MICROBE, Tags.PLANT],
      startingMegaCredits: 42,

      metadata: {
        cardNumber: '??',
        description: 'You start with 42 M€. Increase your plant production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(42).production((pb) => pb.plants(1));
          b.corpBox('effect', (ce) => {
            ce.vSpace();
            ce.effect('When you play a bio tag, including these, gain 1 plant or add 1 microbe on ANY card.', (eb) => {
              eb.microbes(1).played.plants(1).played.animals(1).played.startEffect.plants(1).slash().microbes(1).asterix();
            });
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    this.onCardPlayed(player, this);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    const bioTagCount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBE).length;
    if (bioTagCount === 0) return undefined;

    const microbeCards = player.getResourceCards(ResourceType.MICROBE);
    if (microbeCards.length === 0) {
      player.addResource(Resources.PLANTS, bioTagCount, {log: true});
      return undefined;
    }

    const orOptions = new OrOptions();

    if (microbeCards.length === 1) {
      orOptions.options.push(new SelectOption(`Add microbe resource to ${microbeCards[0].name}`, 'Add resource', () => {
        player.addResourceTo(microbeCards[0], {qty: 1, log: true});
        return undefined;
      }));
    } else {
      orOptions.options.push(new SelectOption('Add microbe resource to a card', 'Add resource', () => {
        return new SelectCard('Select card to add 1 microbe', 'Add microbe', microbeCards, (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], {qty: 1, log: true});
          return undefined;
        });
      }));
    }

    orOptions.options.push(new SelectOption('Gain plant', 'Save', () => {
      player.addResource(Resources.PLANTS, 1, {log: true});
      return undefined;
    }));

    for (let i = 0; i < bioTagCount; i++) {
      player.game.defer(new DeferredAction(
        player,
        () => orOptions,
      ));
    }

    return undefined;
  }
}
