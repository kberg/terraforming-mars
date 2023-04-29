import {expect} from 'chai';
import {AsteroidStandardProject} from '../../../src/cards/base/standardProjects/AsteroidStandardProject';
import {SellPatentsStandardProject} from '../../../src/cards/base/standardProjects/SellPatentsStandardProject';
import {StandardTechnology} from '../../../src/cards/base/StandardTechnology';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';

describe('StandardTechnology', function() {
  it('Should play', function() {
    const card = new StandardTechnology();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);

    const action = card.play();
    card.onStandardProject(player, new SellPatentsStandardProject());
    expect(player.megaCredits).eq(0);

    card.onStandardProject(player, new AsteroidStandardProject());
    expect(player.megaCredits).eq(3);
    expect(action).is.undefined;
  });
});
