import {expect} from 'chai';
import {CyanobacteriaPods} from '../../../src/cards/community/preludes/CyanobacteriaPods';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('CyanobacteriaPods', function() {
  it('Should play', function() {
    const card = new CyanobacteriaPods();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);

    player.megaCredits = 6;
    card.play(player);
    game.deferredActions.runAll(() => {});

    expect(player.getProduction(Resources.PLANTS)).eq(2);
    expect(player.plants).eq(2);
    expect(player.megaCredits).eq(0);
  });
});
