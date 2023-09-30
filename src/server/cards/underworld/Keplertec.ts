import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IPlayer} from '../../IPlayer';
import {ActionCard} from '../ActionCard';
import {CardResource} from '../../../common/CardResource';
import {digit} from '../Options';
import {ICard} from '../ICard';
import {ExcavationToken} from '../../../common/underworld/ExcavationToken';
import {UnderworldExpansion} from '../../../server/underworld/UnderworldExpansion';

export class Keplertec extends ActionCard implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.KEPLERTEC,
      tags: [Tag.JOVIAN, Tag.SPACE],
      startingMegaCredits: 33,
      resourceType: CardResource.FIGHTER,

      behavior: {
        stock: {titanium: 3},
        production: {titanium: 1},
      },

      action: {
        spend: {titanium: 1},
        addResourcesToAnyCard: {
          count: 1,
          autoSelect: true,
          mustHaveCard: true,
          type: CardResource.FIGHTER,
        },
      },

      metadata: {
        cardNumber: 'UC08',
        description: 'You start with 33 M€, 3 titanium, and 1 titanium production.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(33).titanium(3, {digit}).production((pb) => pb.temperature(1)).br;
          b.action('Spend 1 titanium to put a fighter resource on ANY card.', (ab) => {
            ab.megacredits(1).animals(1).startAction.fighter(1).asterix();
          });
          b.effect('After you excavate an underground resource, gain 2 energy.', (eb) => {
            eb.fighter(1).startEffect.text('CHOOSE TOKEN').asterix();
          }).br;
        }),
      },
    });
  }

  effect(player: IPlayer) {
    const game = player.game;
    if (game.underworldData === undefined) {
      return undefined;
    }
    const tokens: Array<ExcavationToken> = [];
    for (let i = 0; i < 4; i++) {
      const token = game.underworldData?.tokens.pop();
      if (token === undefined) {
        // TODO(kberg): handle
        break;
      }
    }
    if (tokens.length === 0) {
      // TODO(kberg): handle
      return;
    }

    UnderworldExpansion.addTokens(game, tokens);
  }

  onResourceAdded(player: IPlayer, _playedCard: ICard, _count: number) {
    const game = player.game;
    if (game.underworldData === undefined) {
      return undefined;
    }
    // TODO(kberg): address count.
    this.effect(player);
  }
}
