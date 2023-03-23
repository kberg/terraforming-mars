import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Turmoil} from '../../../turmoil/Turmoil';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {Resources} from '../../../Resources';
import {Card} from '../../Card';
import {PlaceCityTile} from '../../../deferredActions/PlaceCityTile';
import {Tags} from '../../Tags';

export class MartianRepublic extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARTIAN_REPUBLIC,
      tags: [Tags.BUILDING, Tags.CITY],

      metadata: {
        cardNumber: 'Y38',
        renderData: CardRenderer.builder((b) => {
          b.delegates(2).marsFirst();
          b.city().megacredits(3);
        }),
        description: 'Place 2 delegates into Mars First. Place a city tile and gain 3 M€.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const party = turmoil.parties.find((p) => p.name === PartyName.MARS);
    if (party === undefined) Card.setSocietyWarningText(this, PartyName.MARS);

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);

    if (turmoil.parties.find((p) => p.name === PartyName.MARS)) {
      turmoil.sendDelegateToParty(player.id, PartyName.MARS, game, 'reserve');
      turmoil.sendDelegateToParty(player.id, PartyName.MARS, game, 'reserve');
    } else {
      player.addResource(Resources.MEGACREDITS, 7, {log: true});
    }

    player.addResource(Resources.MEGACREDITS, 3);
    game.defer(new PlaceCityTile(player));

    return undefined;
  }
}
