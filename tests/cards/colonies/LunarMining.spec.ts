import {expect} from 'chai';
import {LunarMining} from '../../../src/cards/colonies/LunarMining';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LunarMining', function() {
  it('Should play', function() {
    const card = new LunarMining();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);

    player.playedCards.push({tags: Array(4).fill(Tags.EARTH)} as IProjectCard);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).eq(2);
  });
});
