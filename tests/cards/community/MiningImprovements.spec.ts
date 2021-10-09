import {expect} from 'chai';
import {MiningImprovements} from '../../../src/cards/community/preludes/MiningImprovements';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MiningImprovements', function() {
  it('Should play', function() {
    const card = new MiningImprovements();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    player.megaCredits = 20;

    card.play(player);
    game.deferredActions.runAll(() => {});
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    expect(player.megaCredits).eq(18);
  });
});
