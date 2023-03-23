import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Turmoil} from '../../../turmoil/Turmoil';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {Resources} from '../../../Resources';
import {Card} from '../../Card';

export class HeatFirstInitiative extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.HEAT_FIRST_INITIATIVE,

      metadata: {
        cardNumber: 'Y37',
        renderData: CardRenderer.builder((b) => {
          b.delegates(2).kelvinists();
          b.temperature(2);
        }),
        description: 'Place 2 delegates into Kelvinists and raise the temperature 2 steps.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const party = turmoil.parties.find((p) => p.name === PartyName.KELVINISTS);
    if (party === undefined) Card.setSocietyWarningText(this, PartyName.KELVINISTS);

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);

    if (turmoil.parties.find((p) => p.name === PartyName.KELVINISTS)) {
      turmoil.sendDelegateToParty(player.id, PartyName.KELVINISTS, game, 'reserve');
      turmoil.sendDelegateToParty(player.id, PartyName.KELVINISTS, game, 'reserve');
    } else {
      player.addResource(Resources.MEGACREDITS, 7, {log: true});
    }

    game.increaseTemperature(player, 2);

    return undefined;
  }
}
