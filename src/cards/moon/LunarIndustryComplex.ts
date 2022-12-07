import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {MoonExpansion} from '../../moon/MoonExpansion';

export class LunarIndustryComplex extends MoonCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_INDUSTRY_COMPLEX,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 28,
      productionBox: Units.of({steel: 1, titanium: 1, energy: 2, heat: 1}),
      reserveUnits: Units.of({titanium: 2}),
      tr: {moonMining: 1},

      metadata: {
        description: 'Spend 2 Titanium. Place a mine tile on the Moon and raise the Mining Rate 1 step. ' +
          'Increase your Steel, Titanium, and Heat production 1 step each. Increase your Energy production 2 steps.',
        cardNumber: 'M74',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).moonMine().br;
          b.production((pb) => pb.steel(1).titanium(1).heat(1).energy(2));
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_MINE],
    });
  };

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) return false;

    const moonData = MoonExpansion.moonData(player.game);
    const spaces = moonData.moon.getAvailableSpacesForMine(player);
    if (spaces.length === 0) return false;

    const trGain = player.computeTerraformRatingBump(this);
    Card.setRedsWarningText(trGain, this);

    return true;
  }

  public play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonMineTile(player));
    return undefined;
  }
}
