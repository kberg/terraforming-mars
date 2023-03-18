import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {IMoonCard} from './IMoonCard';
import {MoonCard} from './MoonCard';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Card} from '../Card';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class MareImbriumMine extends MoonCard implements IProjectCard, IMoonCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      name: CardName.MARE_IMBRIUM_MINE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 19,
      productionBox: Units.of({steel: 1, titanium: 1}),
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonMining: 1},

      metadata: {
        description: 'Spend 1 titanium. Increase your steel production 1 step and your titanium production 1 step. Place a mine ON THE RESERVED AREA and raise the Mining Rate 1 step.',
        cardNumber: 'M03',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1);
          b.production((pb) => pb.steel(1).titanium(1)).br;
          b.moonMine().secondaryTag(AltSecondaryTag.MOON_MINING_RATE).asterix();
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_MINE],
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
      const actionDetails = this.getActionDetails(player, this);
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails, true, false, false, false, true);

      if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
        this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
      }

      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player) {
    super.play(player);
    MoonExpansion.addMineTile(player, MoonSpaces.MARE_IMBRIUM, this.name);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }

  public getActionDetails(_player: Player, card: IProjectCard) {
    return new ActionDetails({card: card, moonMiningRateIncrease: 1});
  }
}
