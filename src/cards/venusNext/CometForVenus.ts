import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {IProjectCard} from '../IProjectCard';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Units} from '../../Units';

export class CometForVenus extends Card {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.COMET_FOR_VENUS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 11,
      tr: {venus: 1},

      metadata: {
        description: 'Raise Venus 1 step. Remove up to 4M€ from any player WITH A VENUS TAG IN PLAY.',
        cardNumber: '218',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).nbsp().nbsp().minus().megacredits(4).secondaryTag(Tags.VENUS).any;
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    const venusTagPlayers = player.game.getPlayers().filter((otherPlayer) => otherPlayer.id !== player.id && otherPlayer.getTagCount(Tags.VENUS, 'raw') > 0);

    if (player.game.isSoloMode()|| venusTagPlayers.length === 0) {
      player.game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }

    if (venusTagPlayers.length > 0) {
      return new OrOptions(
        new SelectPlayer(
          Array.from(venusTagPlayers),
          'Select player to remove up to 4 M€ from',
          'Remove M€',
          (selectedPlayer: Player) => {
            selectedPlayer.deductResource(Resources.MEGACREDITS, 4, {log: true, from: player});
            player.game.increaseVenusScaleLevel(player, 1);
            return undefined;
          },
        ),
        new SelectOption(
          'Do not remove M€',
          'Confirm',
          () => {
            player.game.increaseVenusScaleLevel(player, 1);
            return undefined;
          },
        ),
      );
    }

    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, venusIncrease: 1});
  }
}
