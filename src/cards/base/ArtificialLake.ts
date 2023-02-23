import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';
import {TileType} from '../../TileType';

export class ArtificialLake extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARTIFICIAL_LAKE,
      tags: [Tags.BUILDING],
      cost: 15,
      tr: {oceans: 1},

      requirements: CardRequirements.builder((b) => b.temperature(-6)),
      metadata: {
        description: 'Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.',
        cardNumber: '116',
        renderData: CardRenderer.builder((b) => b.oceans(1).asterix()),
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player) {
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    const game = player.game;
    const board = game.board;
    const canPlaceTile = board.getAvailableSpacesOnLand(player).length > 0;
    if (board.getOceansOnBoard() === player.game.getMaxOceanTilesCount()) return true;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return canPlaceTile && this.howToAffordReds.canAfford;
    }

    return canPlaceTile;
  }

  public play(player: Player) {
    if (player.game.board.getOceansOnBoard() >= player.game.getMaxOceanTilesCount()) return undefined;

    return new SelectSpace('Select a land space to place an ocean', player.game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      player.game.addOceanTile(player, foundSpace.id, SpaceType.LAND);
      return undefined;
    });
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    const landSpaces = player.game.board.getAvailableSpacesOnLand(player);
    return new ActionDetails({card: card, oceansToPlace: 1, nonOceanToPlace: TileType.OCEAN, nonOceanAvailableSpaces: landSpaces});
  }

  public getVictoryPoints() {
    return 1;
  }
}
