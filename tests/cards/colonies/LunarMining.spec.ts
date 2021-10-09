import {expect} from 'chai';
import {LunarMining} from '../../../src/cards/colonies/LunarMining';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LunarMining', function() {
  it('Should play', function() {
    const card = new LunarMining();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);

    player.tagsForTest = {earth: 4};
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).eq(2);
  });
});
