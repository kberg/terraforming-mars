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

export class IntellectualistMovement extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.INTELLECTUALIST_MOVEMENT,
      tags: [Tags.SCIENCE],

      metadata: {
        cardNumber: 'Y42',
        renderData: CardRenderer.builder((b) => {
          b.delegates(2).scientists().br;
          b.cards(3);
        }),
        description: 'Place 2 delegates into Scientists and draw 3 cards.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    const party = turmoil.parties.find((p) => p.name === PartyName.SCIENTISTS);
    if (party === undefined) Card.setSocietyWarningText(this, PartyName.SCIENTISTS);

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);

    if (turmoil.parties.find((p) => p.name === PartyName.SCIENTISTS)) {
      turmoil.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game, 'reserve');
      turmoil.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game, 'reserve');
    } else {
      player.addResource(Resources.MEGACREDITS, 7, {log: true});
    }

    player.drawCard(3);

    return undefined;
  }
}
