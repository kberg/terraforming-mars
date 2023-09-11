import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PreludeCard} from '../prelude/PreludeCard';
import {SelectCard} from '../../inputs/SelectCard';
import {StandardProjectCard} from '../StandardProjectCard';
import {PlayerInput} from '../../PlayerInput';

export class EstablishedMethods extends PreludeCard {
  constructor() {
    super({
      name: CardName.ESTABLISHED_METHODS,
      metadata: {
        cardNumber: '??',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(30).asterix();
        }),
        description: 'Gain 30 M€. Then play standard projects, costing at least 30 M€ in total.',
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.MEGACREDITS, 30);
    let requiredAmountLeftToSpend = 30;

    return EstablishedMethods.selectStandardProject(player, requiredAmountLeftToSpend, 0, (card) => {
      const projectCost = card.cost - card.discount(player);
      requiredAmountLeftToSpend -= projectCost;

      while (requiredAmountLeftToSpend > 0) {
        return EstablishedMethods.selectStandardProject(player, requiredAmountLeftToSpend, projectCost, (card) => {
          const projectCost = card.cost - card.discount(player);
          requiredAmountLeftToSpend -= projectCost;
          return EstablishedMethods.selectStandardProject(player, requiredAmountLeftToSpend, projectCost);
        });
      }

      return undefined;
    });
  }

  private static selectStandardProject(player: Player, remainingAmountRequiredToSpend: number, lastSelectedProjectCost: number, cb: (card: StandardProjectCard) => PlayerInput | undefined = () => undefined) {
    if (remainingAmountRequiredToSpend <= 0) return undefined;

    // At this point player.megacredits has not yet been updated so we need to manually filter out the unaffordable SPs
    const availableStandardProjects =
      player.getStandardProjects()
      .filter((card) => card.canAct(player))
      .filter((card) => card.cost - card.discount(player) <= player.spendableMegacredits() - lastSelectedProjectCost);

    if (availableStandardProjects.length === 0) return undefined;    

    return new SelectCard(
      `Select standard project to do (must spend at least ${remainingAmountRequiredToSpend} more M€)`,
      'Confirm',
      availableStandardProjects,
      (cards) => {
        cards[0].action(player);
        return cb(cards[0]);
      },
    );
  }
}
