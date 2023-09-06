import {expect} from 'chai';
import {AntiDesertificationTechniques} from '../../../src/cards/preludeTwo/AntiDesertificationTechniques';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('AntiDesertificationTechniques', function() {
  let card : AntiDesertificationTechniques; let player : Player;

  beforeEach(() => {
    card = new AntiDesertificationTechniques();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.megaCredits).eq(3);
  });
});
