import {expect} from 'chai';
import {testGame} from '../TestGame';
import {EcoSabotage} from '../../src/server/turmoil/globalEvents/EcoSabotage';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('EcoSabotage', function() {
  it('resolve play', function() {
    const card = new EcoSabotage();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.initGlobalEvent(game);

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.add(player2.id);

    player.plants = 10;
    player2.plants = 10;

    expect(turmoil.getPlayerInfluence(player)).eq(0);
    expect(turmoil.getPlayerInfluence(player2)).eq(2);

    card.resolve(game, turmoil);

    expect(player.plants).to.eq(3);
    expect(player2.plants).to.eq(5);
  });
});
