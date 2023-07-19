import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {IProjectCard} from '../IProjectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class Recyclon extends Card implements CorporationCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.RECYCLON,
      tags: [Tags.MICROBE, Tags.BUILDING],
      startingMegaCredits: 38,
      resourceType: ResourceType.MICROBE,
      productionBox: Units.of({steel: 1}),

      metadata: {
        cardNumber: 'R26',
        description: 'You start with 38 M€ and 1 steel production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(38).nbsp().production((pb) => pb.steel(1));
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a building tag, including this, gain 1 microbe to this card, or remove 2 microbes here and raise your plant production 1 step.', (eb) => {
              eb.building().played.colon().microbes(1).or();
              eb.microbes(2).digit.startEffect.production((pb) => pb.plants(1));
            });
          });
        }),
      },
    });
  }

  public resourceCount = 0;

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 1);
    player.addResourceTo(this);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    return this._onCardPlayed(player, card);
  }

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this._onCardPlayed(player, card);
  }

  private _onCardPlayed(player: Player, card: IProjectCard | CorporationCard) {
    if (card.tags.includes(Tags.BUILDING) === false || !player.isCorporation(this.name)) {
      return undefined;
    }

    const resourceCount = player.getResourcesOnCard(this)!;
    const buildingTagCount = card.tags.filter((tag) => tag === Tags.BUILDING).length;

    if (resourceCount + buildingTagCount < 3) {
      player.addResourceTo(this, {qty: buildingTagCount, log: true});
      return undefined;
    }

    const addResource = new SelectOption('Add a microbe to Recyclon', 'Add microbe', () => {
      player.addResourceTo(this, {log: true});
      return undefined;
    });

    const spendResource = new SelectOption('Remove 2 microbes on Recyclon to increase plant production 1 step', 'Remove microbes', () => {
      player.removeResourceFrom(this, 2);
      player.addProduction(Resources.PLANTS, 1);
      player.game.log('${0} removed 2 microbes from ${1} to increase plant production 1 step', (b) => b.player(player).cardName(this.name));
      return undefined;
    });

    // Special-case: Merge into Mining Guild
    if (buildingTagCount === 2) {
      if (resourceCount === 1) {
        // Add 1 microbe for the first building tag, ask for the second building tag
        player.addResourceTo(this, {log: true});
        return new OrOptions(spendResource, addResource);
      } else {
        // If we get here it means there are already at least 2 microbes on Recyclon
        const addTwoMicrobes = new SelectOption('Add 2 microbes to Recyclon', 'Select', () => {
          player.addResourceTo(this, {qty: buildingTagCount, log: true});
          return undefined;
        });

        const removeTwoMicrobesAndAddOneMicrobe = new SelectOption('Remove 2 microbes on Recyclon to increase plant production 1 step, then add 1 microbe', 'Select', () => {
          player.removeResourceFrom(this, 2);
          player.addProduction(Resources.PLANTS, 1);
          player.game.log('${0} removed 2 microbes from ${1} to increase plant production 1 step', (b) => b.player(player).cardName(this.name));
          player.addResourceTo(this, {log: true});
          return undefined;
        });

        const removeFourMicrobes = new SelectOption('Remove 4 microbes on Recyclon to increase plant production 2 steps', 'Select', () => {
          player.removeResourceFrom(this, 4);
          player.addProduction(Resources.PLANTS, 2);
          player.game.log('${0} removed 4 microbes from ${1} to increase plant production 2 steps', (b) => b.player(player).cardName(this.name));
          return undefined;
        });

        if (resourceCount >= 4) {
          return new OrOptions(removeFourMicrobes, removeTwoMicrobesAndAddOneMicrobe, addTwoMicrobes);
        } else {
          return new OrOptions(removeTwoMicrobesAndAddOneMicrobe, addTwoMicrobes);
        }
      }
    }

    return new OrOptions(spendResource, addResource);
  }
}
