import {expect} from 'chai';
import {CommitteeRepresentative} from '../../../src/cards/community/preludes/CommitteeRepresentative';
import {Game, GameOptions} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectPartyToSendDelegate} from '../../../src/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('CommitteeRepresentative', function() {
  it('Should play', function() {
    const card = new CommitteeRepresentative();
    const player = TestPlayers.BLUE.newPlayer();
    const otherPlayer = TestPlayers.RED.newPlayer();;
    const gameOptions = TestingUtils.setCustomGameOptions() as GameOptions;
    const game = Game.newInstance('foobar', [player, otherPlayer], player, gameOptions);

    card.play(player);
    expect(player.getTerraformRating()).eq(22); // 20 + 2
    expect(game.deferredActions).has.lengthOf(2);

    // Paace a delegate
    const selectParty = game.deferredActions.pop()!.execute() as SelectPartyToSendDelegate;
    selectParty.cb(PartyName.MARS);
    const turmoil = game.turmoil!;
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(1);

    // Fund an award for free
    const fundAwardAction = game.deferredActions.pop()!.execute() as OrOptions;
    fundAwardAction.options[0].cb();
    expect(game.hasBeenFunded(game.awards[0])).is.true;
  });
});
