import {expect} from 'chai';
import {SolarWindPower} from '../../src/server/cards/base/SolarWindPower';
import {testGame} from '../TestGame';
import {ImprovedEnergyTemplates} from '../../src/server/turmoil/globalEvents/ImprovedEnergyTemplates';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('ImprovedEnergyTemplates', function() {
  it('resolve play', function() {
    const card = new ImprovedEnergyTemplates();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);
    turmoil.initGlobalEvent(game);
    player.playedCards.push(new SolarWindPower());
    player2.playedCards.push(new SolarWindPower());
    player2.playedCards.push(new SolarWindPower());
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);
    card.resolve(game, turmoil);
    expect(player.production.energy).to.eq(0);
    expect(player2.production.energy).to.eq(2);
  });
});
