import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class Flooding extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.FLOODING,
      cost: 7,
      tr: {oceans: 1},

      metadata: {
        cardNumber: '188',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).nbsp().minus().megacredits(4).any.asterix();
        }),
        description: 'Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 M€ FROM THE OWNER OF ONE OF THOSE TILES.',
        victoryPoints: -1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);
    if (trGain === 0) return true;

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    } else {
      return true;
    }
  }

  public play(player: Player) {
    if (player.game.isSoloMode()) {
      player.game.defer(new PlaceOceanTile(player));
      return undefined;
    }

    const oceansMaxedBeforePlacement = player.game.board.getOceansOnBoard() === player.game.getMaxOceanTilesCount();
    if (oceansMaxedBeforePlacement === true) return undefined;

    return new SelectSpace(
      'Select space for ocean tile',
      player.game.board.getAvailableSpacesForOcean(player),
      (space: ISpace) => {
        const adjacentPlayers: Set<Player> = new Set<Player>();
        player.game.addOceanTile(player, space.id);

        player.game.board.getAdjacentSpaces(space).forEach((space) => {
          if (space.player && space.player !== player && space.tile) {
            adjacentPlayers.add(space.player);
          }
        });

        if (adjacentPlayers.size > 0) {
          return new OrOptions(
            new SelectPlayer(
              Array.from(adjacentPlayers),
              'Select adjacent player to remove 4 M€ from',
              'Remove credits',
              (selectedPlayer: Player) => {
                selectedPlayer.deductResource(Resources.MEGACREDITS, 4, {log: true, from: player});
                return undefined;
              },
            ),
            new SelectOption(
              'Don\'t remove M€ from adjacent player',
              'Confirm',
              () => {
                return undefined;
              },
            ),
          );
        }
        return undefined;
      },
    );
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, oceansToPlace: 1});
  }
  
  public getVictoryPoints() {
    return -1;
  }
}
