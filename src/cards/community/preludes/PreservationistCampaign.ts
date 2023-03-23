import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Turmoil} from '../../../turmoil/Turmoil';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {Resources} from '../../../Resources';
import {Card} from '../../Card';

export class PreservationistCampaign extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRESERVATIONIST_CAMPAIGN,

      metadata: {
        cardNumber: 'Y39',
        renderData: CardRenderer.builder((b) => {
          b.delegates(2).reds().br;
          b.minus().tr(1).megacredits(18);
        }),
        description: 'Place 2 delegates into Reds. Lower your TR 1 step and gain 18 M€.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const party = turmoil.parties.find((p) => p.name === PartyName.REDS);
    if (party === undefined) Card.setSocietyWarningText(this, PartyName.REDS);

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);

    if (turmoil.parties.find((p) => p.name === PartyName.REDS)) {
      turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'reserve');
      turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'reserve');
    } else {
      player.addResource(Resources.MEGACREDITS, 7, {log: true});
    }

    player.decreaseTerraformRating();
    player.addResource(Resources.MEGACREDITS, 18);

    return undefined;
  }
}
