import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {ICard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Card} from '../Card';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class IntragenSanctuaryHeadquarters extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.INTRAGEN_SANCTUARY_HEADQUARTERS,
      tags: [Tags.ANIMAL, Tags.MOON],
      startingMegaCredits: 38,
      resourceType: ResourceType.ANIMAL,
      initialActionText: 'Place a colony tile on the Moon.',

      metadata: {
        description: 'You start with 38 M€. As your first action, place a colony tile on the Moon and raise the Colony Rate 1 step.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(38).moonColony().secondaryTag(AltSecondaryTag.MOON_COLONY_RATE);
          b.corpBox('effect', (ce) => {
            ce.effect('When any player plays an animal tag (including this), add 1 animal to this card.', (eb) => {
              eb.animals(1).any.played.startEffect.animals(1);
              eb.vpText('1 VP for every 2 animals on this card.');
            });
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
      },
    });
  }

  public resourceCount = 0;

  public initialAction(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }

  public play() {
    // Gains the initial resource from its own tag.
    this.resourceCount = 1;
    return undefined;
  };

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this.onCardPlayed(player, card as ICard as IProjectCard);
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    const count = card.tags.filter((tag) => tag === Tags.ANIMAL).length;
    player.addResourceTo(this, count);
    return undefined;
  }

  public getVictoryPoints() {
    return Math.floor(this.resourceCount / 2);
  }
}
