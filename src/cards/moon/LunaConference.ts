import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {Resources} from '../../Resources';
import {SOCIETY_ADDITIONAL_CARD_COST} from '../../constants';
import {Turmoil} from '../../turmoil/Turmoil';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';

export class LunaConference extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_CONFERENCE,
      cardType: CardType.EVENT,
      tags: [Tags.SCIENCE, Tags.MOON],
      cost: 5,
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),

      metadata: {
        description: 'Requires that Scientists are ruling or that you have 2 delegates there. ' +
        'Gain 2 M€ per road tile on the Moon. Gain 2M€ per colony tile on the Moon.',
        cardNumber: 'M58',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2).slash().moonRoad({size: Size.SMALL}).any.br;
          b.megacredits(2).slash().moonColony({size: Size.SMALL}).any.br;
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);

    if (turmoil.parties.find((p) => p.name === PartyName.SCIENTISTS)) {
      return turmoil.canPlay(player, PartyName.SCIENTISTS);
    }

    return player.canAfford(player.getCardCost(this) + SOCIETY_ADDITIONAL_CARD_COST);
  }

  public play(player: Player) {
    const moonRoadCount = MoonExpansion.tiles(player.game, TileType.MOON_ROAD, {surfaceOnly: true}).length;
    const moonColonyCount = MoonExpansion.tiles(player.game, TileType.MOON_COLONY, {surfaceOnly: true}).length;
    player.addResource(Resources.MEGACREDITS, (moonRoadCount + moonColonyCount) * 2, {log: true});
    TurmoilHandler.handleSocietyPayment(player, PartyName.SCIENTISTS);

    return undefined;
  }
}
