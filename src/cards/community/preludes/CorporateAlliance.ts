import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Turmoil} from '../../../turmoil/Turmoil';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {Resources} from '../../../Resources';
import {Card} from '../../Card';
import {Tags} from '../../Tags';

export class CorporateAlliance extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORPORATE_ALLIANCE,
      tags: [Tags.EARTH],

      metadata: {
        cardNumber: 'Y40',
        renderData: CardRenderer.builder((b) => {
          b.delegates(2).unity();
          b.production((pb) => pb.megacredits(1).titanium(1));
        }),
        description: 'Place 2 delegates into Unity and increase your M€ and titanium production 1 step.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const party = turmoil.parties.find((p) => p.name === PartyName.UNITY);
    if (party === undefined) Card.setSocietyWarningText(this, PartyName.UNITY);

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);

    if (turmoil.parties.find((p) => p.name === PartyName.UNITY)) {
      turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');
      turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');
    } else {
      player.addResource(Resources.MEGACREDITS, 7, {log: true});
    }

    player.addProduction(Resources.MEGACREDITS, 1);
    player.addProduction(Resources.TITANIUM, 1);

    return undefined;
  }
}
