import {CardName} from '../../CardName';
import {Player, PlayerId} from '../../Player';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ProjectCard} from '../ProjectCard';
import {Turmoil} from '../../turmoil/Turmoil';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Game} from '../../Game';
import {IParty} from '../../turmoil/parties/IParty';

export class AnOfferYouCantRefuse extends ProjectCard {
  constructor() {
    super({
      name: CardName.AN_OFFER_YOU_CANT_REFUSE,
      cardType: CardType.EVENT,
      cost: 5,

      metadata: {
        description: 'Exchange a NON-NEUTRAL NON-LEADER delegate with one of your own from the reserve. You may then move your delegate to another party.',
        cardNumber: 'M62',
        renderData: CardRenderer.builder((b) => {
          b.minus().delegates(1).any.asterix().nbsp().plus().delegates(1);
        }),
      },
    });
  };

  private hasReplacebleDelegate(player: Player, party: IParty) {
    return player.game.getPlayers().filter((p) => p.id !== player.id).some((player) => party.getDelegates(player.id) > 1 || (party.getDelegates(player.id) === 1 && party.partyLeader !== player.id));
  }

  // You can play this if you have an available delegate, and if there are non-neutral non-leader delegates available to swap with.
  public canPlay(player: Player) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const hasDelegate = turmoil.hasAvailableDelegates(player.id) || turmoil.lobby.has(player.id);
    if (!hasDelegate) return false;

    return turmoil.parties.some((party) => this.hasReplacebleDelegate(player, party));
  }

  private moveToAnotherParty(game: Game, from: PartyName, delegate: PlayerId): OrOptions {
    const orOptions = new OrOptions();
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.parties.forEach((party) => {
      if (party.name === from) {
        orOptions.options.push(new SelectOption('Do not move', '', () => {
          return undefined;
        }));
      } else {
        orOptions.options.push(new SelectOption(party.name, 'Select', () => {
          turmoil.removeDelegateFromParty(delegate, from, game);
          turmoil.sendDelegateToParty(delegate, party.name, game, 'reserve');
          return undefined;
        }));
      }
    });

    return orOptions;
  }

  public play(player: Player) {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    const orOptions = new OrOptions();

    turmoil.parties.forEach((party) => {
      if (!this.hasReplacebleDelegate(player, party)) return;

      game.getPlayers().filter((p) => p.id !== player.id).forEach((opponent) => {
        if (party.getDelegates(opponent.id) > 1 || (party.getDelegates(opponent.id) === 1 && party.partyLeader !== opponent.id)) {
          const option = new SelectOption(`${party.name} / ${opponent.name}`, 'Select', () => {
            const source = turmoil.hasAvailableDelegates(player.id) ? 'reserve' : 'lobby';
            turmoil.replaceDelegateFromParty(opponent.id, player.id, source, party.name, game);
            turmoil.checkDominantParty(party); // Check dominance right after replacement (replace doesn't check dominance.)
            return this.moveToAnotherParty(game, party.name, player.id);
          });

          orOptions.options.push(option);
        }
      });
    });

    return orOptions;
  }
}
