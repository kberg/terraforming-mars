import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {SellSteel} from '../../moon/SellSteel';
import {SOCIETY_ADDITIONAL_CARD_COST} from '../../constants';
import {Turmoil} from '../../turmoil/Turmoil';
import {TurmoilHandler} from '../../turmoil/TurmoilHandler';

export class MooncrateConvoysToMars extends Card {
  constructor() {
    super({
      name: CardName.MOONCRATE_CONVOYS_TO_MARS,
      cardType: CardType.EVENT,
      cost: 13,
      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),

      metadata: {
        description: 'Requires that Mars First are ruling or that you have 2 delegates there. ' +
          'Raise the Logistic Rate 1 step. All players may sell their steel resources for 3M€ each.',
        cardNumber: 'M60',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate().br;
          b.text('X').steel(1).any.colon().text('X').megacredits(3);
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);

    if (turmoil.parties.find((p) => p.name === PartyName.MARS)) {
      return turmoil.canPlay(player, PartyName.MARS);
    }

    return player.canAfford(player.getCardCost(this) + SOCIETY_ADDITIONAL_CARD_COST);
  }

  public play(player: Player) {
    TurmoilHandler.handleSocietyPayment(player, PartyName.MARS);
    MoonExpansion.raiseLogisticRate(player, 1);
    const game = player.game;
    game.getPlayers().forEach((player) => {
      game.defer(new SellSteel(player));
    });
    return undefined;
  }
}
