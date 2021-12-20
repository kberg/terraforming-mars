import {expect} from 'chai';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {EcologyLake} from '../../../src/cards/community/preludes/EcologyLake';
import {SelectSpace} from '../../../src/inputs/SelectSpace';

describe('EcologyLake', function() {
  it('Should play', function() {
    const card = new EcologyLake();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const initialTR = player.getTerraformRating();
    card.play(player);

    const selectSpace = game.deferredActions.pop()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);

    expect(player.getTerraformRating()).eq(initialTR + 1);
    expect(player.plants).greaterThanOrEqual(5);
  });
});
