import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {Resources} from '../../Resources';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Size} from '../render/Size';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';

export class Ryu extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.RYU,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L30',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.text('PAY', Size.SMALL).megacredits(2).multiplier.colon().text('SWAP X', Size.SMALL).production((pb) => pb.wild(1));
          b.br.br;
        }),
        description: 'Once per game, pay 2X M€ to swap up to X of any two productions, where X is the current generation number.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    if (player.canAfford(player.game.generation * 2) === false) return false;

    const resources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
    if (resources.some((res) => this.productionIsDecreasable(player, res)) === false) return false;

    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const resources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
    const choices = new OrOptions();

    resources.filter((r) => this.productionIsDecreasable(player, r)).forEach((resourceToDecrease) => {
      const selectOption = new SelectOption(`Decrease ${resourceToDecrease} production`, 'Select', () => {
        // M€ production can go down to -5
        const decreasable = resourceToDecrease === Resources.MEGACREDITS ? player.getProduction(resourceToDecrease) + 5 : player.getProduction(resourceToDecrease);
        const maxDecreasableAmt = Math.min(player.game.generation, decreasable);

        return new SelectAmount(
          `Select amount of ${resourceToDecrease} production to decrease`,
          'Decrease',
          (amount: number) => {
            const productionToIncrease =
              resources.filter((res) => res !== resourceToDecrease)
              .map((res) => new SelectOption(`Increase ${res} production`, 'Select', () => {
                  player.game.defer(new SelectHowToPayDeferred(player, player.game.generation * 2, {title: 'Select how to pay for action'}));
                  player.addProduction(resourceToDecrease, -amount, {log: true});
                  player.addProduction(res, amount, {log: true});
                  return undefined;
              }));

            return new OrOptions(...productionToIncrease);
          },
          1,
          maxDecreasableAmt,
          true
        );
      });

      choices.options.push(selectOption);
    });

    this.isDisabled = true;
    return choices;
  }

  private productionIsDecreasable(player: Player, resource: Resources): boolean {
    if (resource === Resources.MEGACREDITS) return player.getProduction(resource) > -5;
    return player.getProduction(resource) > 0;
  }
}
