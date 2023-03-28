import {StandardActionCard} from '../../StandardActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {MAX_OXYGEN_LEVEL} from '../../../constants';
import {SelectSpace} from '../../../inputs/SelectSpace';
import {ISpace} from '../../../boards/ISpace';
import {Card} from '../../Card';
import {TileType} from '../../../TileType';
import {ActionDetails, RedsPolicy} from '../../../turmoil/RedsPolicy';

export class ConvertPlantsEcoline extends StandardActionCard {
  constructor() {
    super({
      name: CardName.CONVERT_PLANTS_ECOLINE,
      tr: {oxygen: 1},
      metadata: {
        cardNumber: 'SA3',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 7 Plants to place a greenery tile and raise oxygen 1 step.', (eb) => {
            eb.plants(7).startAction.greenery();
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this, false, 'take this action');

    if (player.plants < player.plantsNeededForGreenery) {
      return false;
    }
    if (player.game.board.getAvailableSpacesForGreenery(player).length === 0) {
      return false;
    }
    if (player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL) {
      return true;
    }
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      const actionDetails = new ActionDetails({
        oxygenIncrease: 1,
        nonOceanToPlace: TileType.GREENERY,
        nonOceanAvailableSpaces: player.game.board.getAvailableSpacesForGreenery(player),
      });

      const howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);
      return howToAffordReds.canAfford;
    }
    return true;
  }

  public action(player: Player) {
    return new SelectSpace(
      `Convert ${player.plantsNeededForGreenery} plants into greenery`,
      player.game.board.getAvailableSpacesForGreenery(player),
      (space: ISpace) => {
        this.actionUsed(player);
        player.game.addGreenery(player, space.id);
        player.plants -= player.plantsNeededForGreenery;
        return undefined;
      },
    );
  }
}
