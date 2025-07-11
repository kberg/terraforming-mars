import {expect} from 'chai';
import {WarOnEarth} from '../../src/server/turmoil/globalEvents/WarOnEarth';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('WarOnEarth', () => {
  it('resolve play', () => {
    const card = new WarOnEarth();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    player.setTerraformRating(15);
    player2.setTerraformRating(15);

    card.resolve(game, turmoil);
    expect(player.terraformRating).to.eq(11);
    expect(player2.terraformRating).to.eq(14);
  });
});
