import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {ActionDetails, HowToAffordRedsPolicy, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class BlackPolarDust extends Card implements IProjectCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BLACK_POLAR_DUST,
      cost: 15,
      tr: {oceans: 1},

      metadata: {
        cardNumber: '022',
        description: 'Place an ocean tile. Decrease your M€ production 2 steps and increase your heat production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().heat(3);
          }).oceans(1);
        }),
      },
    });
  }
  public canPlay(player: Player): boolean {
    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    const game = player.game;
    const hasEnoughMegacreditProduction = player.getProduction(Resources.MEGACREDITS) >= -3;
    if (trGain === 0) return hasEnoughMegacreditProduction;

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return hasEnoughMegacreditProduction && this.howToAffordReds.canAfford;
    }

    return hasEnoughMegacreditProduction;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -2);
    player.addProduction(Resources.HEAT, 3);
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }

  public getActionDetails(player: Player, card: IProjectCard) {
    const spaces = player.game.board.getAvailableSpacesForOcean(player);
    return new ActionDetails({card: card, oceansToPlace: 1, oceansAvailableSpaces: spaces});
  }
}
