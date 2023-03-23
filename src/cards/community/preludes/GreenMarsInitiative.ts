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
import {PlaceGreeneryTile} from '../../../deferredActions/PlaceGreeneryTile';

export class GreenMarsInitiative extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.GREEN_MARS_INITIATIVE,
      tags: [Tags.PLANT],

      metadata: {
        cardNumber: 'Y41',
        renderData: CardRenderer.builder((b) => {
          b.delegates(2).greens();
          b.greenery();
        }),
        description: 'Place 2 delegates into Greens and place a greenery tile.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const party = turmoil.parties.find((p) => p.name === PartyName.GREENS);
    if (party === undefined) Card.setSocietyWarningText(this, PartyName.GREENS);

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);

    if (turmoil.parties.find((p) => p.name === PartyName.GREENS)) {
      turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game, 'reserve');
      turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game, 'reserve');
    } else {
      player.addResource(Resources.MEGACREDITS, 7, {log: true});
    }

    game.defer(new PlaceGreeneryTile(player));

    return undefined;
  }
}
