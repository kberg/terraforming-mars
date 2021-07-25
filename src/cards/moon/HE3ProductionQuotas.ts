import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {Turmoil} from '../../turmoil/Turmoil';
import {SOCIETY_ADDITIONAL_CARD_COST} from '../../constants';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';

export class HE3ProductionQuotas extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HE3_PRODUCTION_QUOTAS,
      cardType: CardType.EVENT,
      tags: [Tags.MOON],
      cost: 10,

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS).miningTiles(1).any()),
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there, and 1 mine tile on the Moon. ' +
        'Pay 1 steel per mine tile on the Moon to gain 4 heat per mine tile on the Moon. Raise the Mining Rate 1 step.',
        cardNumber: 'M57',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).slash().moonMine({size: Size.SMALL}).any
            .colon().text('4').heat(1).slash().moonMine({size: Size.SMALL}).any.br;
          b.moonMiningRate();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const hasMiningTileOnMoon = MoonExpansion.tiles(player.game, TileType.MOON_MINE, {surfaceOnly: true}).length >= 1;
    const moonTiles = MoonExpansion.tiles(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    const canAffordSteelCost = player.steel >= moonTiles.length;

    if (turmoil.parties.find((p) => p.name === PartyName.KELVINISTS)) {
      return turmoil.canPlay(player, PartyName.KELVINISTS) && hasMiningTileOnMoon && canAffordSteelCost;
    }

    const canAffordCard = player.canAfford(player.getCardCost(this) + SOCIETY_ADDITIONAL_CARD_COST);

    return canAffordCard && hasMiningTileOnMoon && canAffordSteelCost;
  }

  public play(player: Player) {
    const moonTiles = MoonExpansion.tiles(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    player.steel -= moonTiles.length;
    player.heat += (4 * moonTiles.length);
    MoonExpansion.raiseMiningRate(player);
    TurmoilHandler.handleSocietyPayment(player, PartyName.KELVINISTS);
    return undefined;
  }
}
