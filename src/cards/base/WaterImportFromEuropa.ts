import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class WaterImportFromEuropa extends Card implements IActionCard, IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.WATER_IMPORT_FROM_EUROPA,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 25,

      metadata: {
        cardNumber: '012',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 12 M€ to place an ocean tile. TITANIUM MAY BE USED as if playing a Space card.', (eb) => {
            eb.megacredits(12).titanium(1).brackets.startAction.oceans(1);
          }).br;
          b.vpText('1 VP for each Jovian tag you have.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.jovians(1, 1),
      },
    });
  }

  public getVictoryPoints(player: Player) {
    return player.getTagCount(Tags.JOVIAN, 'raw');
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const oceansMaxed = player.game.board.getOceansOnBoard() === player.game.getMaxOceanTilesCount();
    const oceanCost = 12;

    const trGain = oceansMaxed ? 0 : 1;
    const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);
    Card.setRedsActionWarningText(player, trGain, this, redsAreRuling);

    if (oceansMaxed) {
      Card.setUselessActionWarningText(this, 'all oceans have already been placed');
      return player.canAfford(oceanCost, {titanium: true});
    }

    if (redsAreRuling) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails();
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return player.canAfford(oceanCost, {titanium: true});
  }

  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 12, {canUseTitanium: true, title: 'Select how to pay for action', afterPay: () => {
      // This line is needed if the action places or could potentially place a tile
      if (this.howToAffordReds !== undefined) player.howToAffordReds = this.howToAffordReds;
      player.game.defer(new PlaceOceanTile(player));
    }}));

    return undefined;
  }

  public getActionDetails() {
    return new ActionDetails({cost: 12, oceansToPlace: 1});
  }
}
