import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class EcologyExperts extends PreludeCard {
  constructor() {
    super({
      name: CardName.ECOLOGY_EXPERTS,
      tags: [Tags.PLANT, Tags.MICROBE],

      metadata: {
        cardNumber: 'P10',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).br.br;
          b.projectRequirements();
        }),
        description: 'Increase your plant production 1 step. Play a card from hand, ignoring global requirements.',
      },
    });
  }

  // Magic number high enough to always ignore requirements.
  public requirementsBonus: number = 50;

  public getRequirementBonus(player: Player): number {
    if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
      return this.requirementsBonus;
    }
    return 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    let copiedByDoubleDown: boolean = false;

    player.game.defer(new DeferredAction(player, () => {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === CardName.DOUBLE_DOWN) {
        copiedByDoubleDown = true;
        player.requirementsBonus += this.requirementsBonus;
      }
      return undefined;
    }));

    player.game.defer(new PlayProjectCard(player));

    player.game.defer(new DeferredAction(player, () => {
      if (copiedByDoubleDown) player.requirementsBonus -= this.requirementsBonus;
      return undefined;
    }));

    return undefined;
  }
}
