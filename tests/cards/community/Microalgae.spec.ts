import {expect} from 'chai';
import {Microalgae} from '../../../src/cards/community/preludes/Microalgae';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Microalgae', function() {
  it('Should play', function() {
    const card = new Microalgae();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const initialTR = player.getTerraformRating();
    card.play(player);

    const selectSpace = game.deferredActions.pop()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);

    expect(player.getTerraformRating()).eq(initialTR + 1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.plants).eq(2);
  });
});
