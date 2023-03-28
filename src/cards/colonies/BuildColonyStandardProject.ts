import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {ColonyName} from '../../colonies/ColonyName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Colony} from '../../colonies/Colony';
import {RedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {MAX_OCEAN_TILES, MAX_VENUS_SCALE} from '../../constants';
import {Card} from '../Card';

export class BuildColonyStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.BUILD_COLONY_STANDARD_PROJECT,
      cost: 17,
      metadata: {
        cardNumber: 'SP5',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 17 M€ to place a colony.', (eb) => {
            eb.megacredits(17).startAction.colonies();
          }),
        ),
      },
    });
  }

  private getOpenColonies(player: Player): Array<Colony> {
    let openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.colonies.includes(player.id) === false);

    if (player.game.gameOptions.equalOpportunityVariant === false) {
      openColonies = openColonies.filter((colony) => colony.colonies.length < 3);
    }

    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

    if (redsAreRuling) {
      const bonusMegaCredits = player.cardIsInEffect(CardName.NAOMI) ? 3 : 0;

      const canAffordToBuildOnEuropaColony = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({card: this, oceansToPlace: 1, bonusMegaCredits: bonusMegaCredits}));
      if (canAffordToBuildOnEuropaColony.canAfford === false) openColonies = openColonies.filter((c) => c.name !== ColonyName.EUROPA);

      const canAffordToBuildOnVenusColony = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({card: this, venusIncrease: 1, bonusMegaCredits: bonusMegaCredits}));
      if (canAffordToBuildOnVenusColony.canAfford === false) openColonies = openColonies.filter((c) => c.name !== ColonyName.VENUS);

      const canAffordToBuildOnIapetusColony = RedsPolicy.canAffordRedsPolicy(player, player.game, new ActionDetails({card: this, TRIncrease: 1, bonusMegaCredits: bonusMegaCredits}));
      if (canAffordToBuildOnIapetusColony.canAfford === false) openColonies = openColonies.filter((c) => c.name !== ColonyName.IAPETUS);
    }

    return openColonies;
  }

  public canAct(player: Player): boolean {
    const availableColonies = this.getOpenColonies(player);
    const colonyNames = availableColonies.map((c) => c.name);

    const hasEuropa = colonyNames.includes(ColonyName.EUROPA) && player.game.board.getOceansOnBoard() < MAX_OCEAN_TILES;
    const hasVenus = colonyNames.includes(ColonyName.VENUS) && player.game.getVenusScaleLevel() < MAX_VENUS_SCALE;
    const hasIapetus = colonyNames.includes(ColonyName.IAPETUS);

    if (hasEuropa || hasVenus || hasIapetus) {
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
      Card.setRedsActionWarningText(player, 1, this, redsAreRuling, 'build a colony', true);
    }

    return super.canAct(player) && availableColonies.length > 0;
  }

  actionEssence(player: Player): void {
    player.game.defer(new BuildColony(player, false, 'Select colony'));
  }
}
