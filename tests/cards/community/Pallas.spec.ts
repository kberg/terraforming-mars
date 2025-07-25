import {expect} from 'chai';
import {Pallas} from '../../../src/server/cards/community/Pallas';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {IParty} from '../../../src/server/turmoil/parties/IParty';
import {MultiSet} from 'mnemonist';

describe('Pallas', () => {
  let pallas: Pallas;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;
  let greens: IParty;
  let scientists: IParty;

  beforeEach(() => {
    pallas = new Pallas();
    [game, player, player2] = testGame(2, {turmoilExtension: true, coloniesExtension: true});
    game.colonies.push(pallas);
    turmoil = Turmoil.getTurmoil(game);
    greens = turmoil.getPartyByName(PartyName.GREENS);
    scientists = turmoil.getPartyByName(PartyName.SCIENTISTS);

    greens.delegates.clear();
    scientists.delegates.clear();
  });

  it('Should build', () => {
    expect(turmoil.getInfluence(player)).eq(0);
    expect(turmoil.getInfluence(player2)).eq(0);
    pallas.addColony(player);
    expect(turmoil.getInfluence(player)).eq(1);
    expect(turmoil.getInfluence(player2)).eq(0);
    pallas.addColony(player);
    expect(turmoil.getInfluence(player)).eq(2);
    expect(turmoil.getInfluence(player2)).eq(0);
    pallas.addColony(player2);
    expect(turmoil.getInfluence(player)).eq(2);
    expect(turmoil.getInfluence(player2)).eq(1);
  });

  it('Should trade', () => {
    pallas.trackPosition = 4; // Send 2 delegates
    pallas.trade(player);

    expect(greens.delegates.size).eq(0);
    expect(scientists.delegates.size).eq(0);

    runAllActions(game);

    const selectParty = cast(player.popWaitingFor(), SelectParty);
    selectParty.cb(PartyName.GREENS);
    expect(greens.delegates).deep.eq(MultiSet.from([player]));
    expect(scientists.delegates.size).eq(0);

    runAllActions(game);

    const selectParty2 = cast(player.popWaitingFor(), SelectParty);
    selectParty2.cb(PartyName.SCIENTISTS);

    expect(greens.delegates).deep.eq(MultiSet.from([player]));
    expect(scientists.delegates).deep.eq(MultiSet.from([player]));

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
  });

  it('Should give trade bonus', () => {
    pallas.addColony(player);
    player.megaCredits = 0;
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    pallas.trade(player2); // player2 is trading. But player(1) is getting the MC
    runAllActions(game);
    const sendDelegates = cast(player2.popWaitingFor(), SelectParty);
    sendDelegates.cb(PartyName.REDS);
    runAllActions(game);

    expect(player.megaCredits).eq(3);
  });

  it('Colony benefit occurs after trade bonus', () => {
    pallas.addColony(player);
    player.megaCredits = 0;
    pallas.trackPosition = 2; // Send 1 delegate
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
    pallas.trade(player); // player(1) is trading and gaining the mc.
    runAllActions(game);
    const sendDelegates = cast(player.popWaitingFor(), SelectParty);
    sendDelegates.cb(PartyName.REDS);
    runAllActions(game);

    expect(player.megaCredits).eq(4);
  });
});
