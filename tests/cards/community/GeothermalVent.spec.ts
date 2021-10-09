import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {GeothermalVent} from '../../../src/cards/community/preludes/GeothermalVent';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('GeothermalVent', function() {
  let card : GeothermalVent; let player : Player; let game: Game;

  beforeEach(() => {
    card = new GeothermalVent();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const initialTR = player.getTerraformRating();
    card.play(player);

    expect(player.getProduction(Resources.HEAT)).eq(2);
    expect(game.getTemperature()).eq(-26);
    expect(player.getTerraformRating()).eq(initialTR + 2);
  });
});
