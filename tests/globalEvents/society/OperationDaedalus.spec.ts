import {expect} from 'chai';
import {OperationDaedalus} from '../../../src/turmoil/globalEvents/society/OperationDaedalus';
import {Game} from '../../../src/Game';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestPlayers} from '../../TestPlayers';

describe('OperationDaedalus', function() {
  it('resolve play', function() {
    const card = new OperationDaedalus();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.dominantParty = turmoil.getPartyByName(PartyName.REDS)!;
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player.id);

    player.megaCredits = 5;
    player2.megaCredits = 5;

    card.resolve(game, turmoil);
    expect(player.titanium).eq(1);
    expect(player2.titanium).eq(2);
    expect(player.megaCredits).eq(0);
  });
});