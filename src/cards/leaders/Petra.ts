import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from '../LeaderCard';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Turmoil} from '../../turmoil/Turmoil';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {SelectPartyToSendDelegate} from '../../inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../turmoil/parties/PartyName';
import { Resources } from '../../Resources';

export class Petra extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.PETRA,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L16',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.minus().text('ALL').delegates(1).any.colon().megacredits(3).asterix();
          b.br.br;
          b.plus().delegates(3).asterix;
        }),
        description: 'Once per game, replace all Neutral delegates with your delegates. Gain 3 M€ for each delegate replaced this way. Place 3 Neutral delegates.',
      },
    });
  }

  public isDisabled = false;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const turmoil = player.game.turmoil;
    if (turmoil === undefined) return false;

    let delegatesToReplace = turmoil.parties.map((party) => party.getDelegates("NEUTRAL")).reduce((a, b) => a + b, 0);
    if (turmoil.chairman === "NEUTRAL") delegatesToReplace += 1;

    let playerTotalDelegateCount = turmoil.getDelegatesInReserve(player.id);
    if (turmoil.lobby.has(player.id)) playerTotalDelegateCount += 1;

    return playerTotalDelegateCount >= delegatesToReplace && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const turmoil = player.game.turmoil as Turmoil;
    let count = 0;

    // Replace all neutral delegates in parties
    turmoil.parties.forEach((party) => {
      while (party.delegates.includes("NEUTRAL")) {
        const source = turmoil.hasAvailableDelegates(player.id) ? 'reserve' : 'lobby';
        turmoil.replaceDelegateFromParty("NEUTRAL", player.id, source, party.name, player.game);
        count++;
      }
      turmoil.checkDominantParty(party);
    });

    // Replace chairman if it is neutral
    if (turmoil.chairman === "NEUTRAL") {
      turmoil.delegateReserve.push("NEUTRAL");
      turmoil.chairman = player.id;
      count++;

      const index = turmoil.delegateReserve.indexOf(player.id);
      if (index > -1) {
        turmoil.delegateReserve.splice(index, 1);
      } else {
        turmoil.lobby.delete(player.id);
      }
    }

    player.addResource(Resources.MEGACREDITS, count * 3, {log: true});

    // Place 3 Neutral delegates
    const availableParties = turmoil.parties.map((party) => party.name);
    const title = 'Select where to send a Neutral delegate';

    for (let i = 0; i < 3; i++) {
      player.game.defer(new DeferredAction(player, () => {
        return new SelectPartyToSendDelegate(title, 'Send delegate', availableParties, (partyName: PartyName) => {
          turmoil.sendDelegateToParty('NEUTRAL', partyName, player.game);
          player.game.log('${0} sent ${1} Neutral delegate in ${2} area', (b) => b.player(player).number(1).party(turmoil.getPartyByName(partyName)));
          return undefined;
        });
      }));
    }

    this.isDisabled = true;
    return undefined;
  }
}