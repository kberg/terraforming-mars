import {CorporationCard} from '../../corporation/CorporationCard';
import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardType} from '../../CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {Size} from '../../render/Size';
import {Card} from '../../Card';
import {Tags} from '../../Tags';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectOption} from '../../../inputs/SelectOption';
import {ResourceType} from '../../../ResourceType';
import {Priority} from '../../../deferredActions/DeferredAction';
import {DiscardCards} from '../../../deferredActions/DiscardCards';
import {DrawCards} from '../../../deferredActions/DrawCards';

export class SecretSantaSociety extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.SECRET_SANTA_SOCIETY,
      tags: [Tags.WILDCARD],
      resourceType: ResourceType.SCIENCE,
      startingMegaCredits: 36,

      metadata: {
        cardNumber: 'R57',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(36);
          b.text('(You start with 36 M€.)', Size.TINY, false, false);

          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action(undefined, (eb) => {
              eb.empty().startAction.science(1).nbsp().or(Size.LARGE);
            });
            ce.vSpace(Size.SMALL);
            ce.action('Add 1 science resource to this card, OR remove 1 science resource from this card to discard 1 card, then draw 3 cards. All OPPONENTS draw 1 card.', (eb) => {
              eb.science(1).startAction.minus(Size.SMALL).cards(1).cards(3).digit.nbsp(Size.SMALL).cards(1).any.asterix();
            });
            ce.vSpace(Size.SMALL);
          });
        }),
      },
    });
  }

  public resourceCount: number = 0;

  public play() {
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    if (this.resourceCount === 0) return this.addResource(player);

    const opts: Array<SelectOption> = [];
    const addResource = new SelectOption('Add 1 science resource to this card', 'Add resource', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 1 science resource to discard 1 card and draw 3 cards', 'Remove resource', () => this.spendResource(player));
    opts.push(addResource);
    opts.push(spendResource);

    return new OrOptions(...opts);
  }

  public addResource(player: Player) {
    player.addResourceTo(this, {qty: 1, log: true});
    return undefined;
  }

  public spendResource(player: Player) {
    player.removeResourceFrom(this, 1);
    
    player.game.defer(new DiscardCards(player), Priority.SPONSORED_ACADEMIES);
    player.game.defer(DrawCards.keepAll(player, 3), Priority.SPONSORED_ACADEMIES);
    const otherPlayers = player.game.getPlayers().filter((p) => p.id !== player.id);
    for (const p of otherPlayers) {
      player.game.defer(DrawCards.keepAll(p));
    }
    return undefined;
  }
}
