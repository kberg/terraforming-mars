import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {ColonyName} from '../../colonies/ColonyName';
import {SelectColony} from '../../inputs/SelectColony';
import {ColonyModel} from '../../models/ColonyModel';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class DarksideSmugglersUnion extends Card implements IProjectCard, IActionCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.DARKSIDE_SMUGGLERS_UNION,
      cardType: CardType.ACTIVE,
      tags: [Tags.SPACE],
      cost: 17,
      tr: {moonLogistics: 1},

      metadata: {
        cardNumber: 'M80',
        description: 'Raise the Logistics Rate 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.action('Perform a trade action.', (ab) => {
            ab.empty().startAction.trade();
          }).br;
          b.br;
          b.moonLogisticsRate();
        }),
      },
    });
  };

  public canAct(player: Player) {
    const openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
    return openColonies.length > 0 && player.getFleetSize() > player.tradesThisGeneration;
  }

  public action(player: Player) {
    const openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
    const coloniesModel: Array<ColonyModel> = player.game.getColoniesModel(openColonies);

    player.game.defer(new DeferredAction(
      player,
      () => new SelectColony('Select colony tile to trade with for free', 'Select', coloniesModel, (colonyName: ColonyName) => {
        openColonies.forEach((colony) => {
          if (colony.name === colonyName) {
            player.game.log('${0} traded with ${1}', (b) => b.player(player).colony(colony));
            colony.trade(player);
            return undefined;
          }

          return undefined;
        });

        return undefined;
      }),
    ));

    return undefined;
  }

  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(player, trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    this.howToAffordReds = undefined;
    return true;
  }

  public play(player: Player) {
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonLogisticsRateIncrease: 1});
  }
}
