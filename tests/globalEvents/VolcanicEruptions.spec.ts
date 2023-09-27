import {expect} from 'chai';
import {testGame} from '../TestGame';
import {VolcanicEruptions} from '../../src/server/turmoil/globalEvents/VolcanicEruptions';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('VolcanicEruptions', function() {
  it('resolve play', function() {
    const card = new VolcanicEruptions();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    turmoil.dominantParty.delegates.add(player2.id);

    card.resolve(game, turmoil);
    expect(player.production.heat).to.eq(0);
    expect(player2.production.heat).to.eq(3);
    expect(game.getTemperature()).to.eq(-26);
  });
});
