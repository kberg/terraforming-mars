import {Dealer} from "../Dealer";
import {DeferredAction} from "../deferredActions/DeferredAction";
import {OrOptions} from "../inputs/OrOptions";
import {SelectOption} from "../inputs/SelectOption";
import {Player} from "../Player";
import {Resources} from "../Resources";
import {SpaceBonus} from "../SpaceBonus";
import {Multiset} from "../utils/Multiset";

export class ArchaeologyHandler {
  // Exploration gives the player a chance to gain some bonus from an empty tile
  // But 60% of the time, they will still end up finding nothing
  public static explore(player: Player) {
    if (!player.canAfford(2)) {
      resolveExplorationBonus(player);
      return undefined;
    }

    player.game.defer(new DeferredAction(player, () => {
      return new OrOptions(
        new SelectOption('Dig once', 'Select', () => {
          resolveExplorationBonus(player);
          return undefined;
        }),
        new SelectOption('Pay 2 M€ to dig twice', 'Select', () => {
          player.game.defer(new DeferredAction(player, () => {
            player.deductResource(Resources.MEGACREDITS, 2, {log: true});
            return undefined;
          }));
          player.game.defer(new DeferredAction(player, () => {
            resolveExplorationBonus(player);
            resolveExplorationBonus(player);
            return undefined;
          }));
          return undefined;
        }),
      );
    }));

    return undefined;
  }
}

function getDeck() {
  const bonuses = [
    Array(1).fill(SpaceBonus.STEEL),
    Array(3).fill(SpaceBonus.STEEL),
    Array(1).fill(SpaceBonus.TITANIUM),
    Array(2).fill(SpaceBonus.TITANIUM),
    Array(1).fill(SpaceBonus.PLANT),
    Array(3).fill(SpaceBonus.PLANT),
    Array(2).fill(SpaceBonus.POWER),
    Array(3).fill(SpaceBonus.POWER),
    Array(2).fill(SpaceBonus.HEAT),
    Array(4).fill(SpaceBonus.HEAT),
    Array(2).fill(SpaceBonus.MICROBE),
    Array(1).fill(SpaceBonus.ANIMAL),
  ];

  return Array(18).fill([]).concat(bonuses);
}

function resolveExplorationBonus(player: Player) {
  const game = player.game;
  let deck: SpaceBonus[][] = getDeck();
  deck = Dealer.shuffle(deck);

  const bonuses: Multiset<SpaceBonus> = new Multiset(deck.pop());
        
  if (bonuses.entries().length === 0) {
    game.log('${0} searched and found... Nothing', (b) => b.player(player));
  } else {
    game.log('${0}\'s search was successful!', (b) => b.player(player));
    bonuses.entries().forEach(([bonus, count]) => {
    game.grantSpaceBonus(player, bonus, count);
    });
  }
}

