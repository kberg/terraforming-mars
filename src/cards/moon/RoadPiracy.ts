import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class RoadPiracy extends Card {
  constructor() {
    super({
      name: CardName.ROAD_PIRACY,
      cardType: CardType.EVENT,
      tags: [Tags.MOON],
      cost: 10,
      requirements: CardRequirements.builder((b) => b.logisticRate(3)),

      metadata: {
        description: 'Requires 3 Logistic rate. ' +
          'Steal up to 6 steel or 4 titanium from other players. ' +
          '(Resources may be stolen from more than 1 opponent.)',
        cardNumber: 'M54',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.text('STEAL').steel(6).any.slash().titanium(4).any.digit.asterix();
        }),
      },
    });
  };

  public play(player: Player) {
    const game = player.game;
    const stealSteel = 'Steal up to 6 steel';
    const stealTitanium = 'Steal up to 4 titanium';

    if (game.isSoloMode()) {
      return new OrOptions(
        new SelectOption(stealSteel, 'Steal steel', () => {
          player.addResource(Resources.STEEL, 6, {log: true});
          return undefined;
        }),
        new SelectOption(stealTitanium, 'Steal titanium', () => {
          player.addResource(Resources.TITANIUM, 4, {log: true});
          return undefined;
        }),
      );
    }

    const options = new OrOptions();

    const steelOption = this.generateOption(player, Resources.STEEL, stealSteel, 6);
    if (steelOption !== undefined) options.options.push(steelOption);

    const titaniumOption = this.generateOption(player, Resources.TITANIUM, stealTitanium, 4);
    if (titaniumOption !== undefined) options.options.push(titaniumOption);

    if (options.options.length === 0) return undefined;

    options.options.push(new SelectOption('Do not steal', 'Confirm', () => {
      return undefined;
    }));

    return options;
  }

  private generateOption(player: Player, resource: Resources, title: string, limit: number) {
    const selectAmounts: Array<SelectAmount> = [];
    const ledger: Map<Player, number> = new Map();

    for (const opponent of player.game.getPlayers()) {
      if (opponent === player) continue;

      if (opponent.getResource(resource) > 0) {
        const cb = (amount: number) => {
          ledger.set(opponent, amount);
          return undefined;
        };
        const selectAmount = new SelectAmount(`${opponent.name}`, undefined, cb, 0, opponent.getResource(resource));
        selectAmounts.push(selectAmount);
      }
    }

    if (selectAmounts.length === 0) return undefined;

    const cb = () => {
      const total = Array.from(ledger.values()).reduce((a, b) => a + b, 0);

      if (total > limit) {
        ledger.clear(); // Empty the ledger
        throw new Error(`You may only steal up to ${limit} ${resource} from all players`);
      }

      for (const entry of ledger) {
        entry[0].stealResource(resource, entry[1], player);
      }

      return undefined;
    };

    const option = new AndOptions(cb, ...selectAmounts);
    option.title = title;
    return option;
  }
}
