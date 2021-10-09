import {expect} from 'chai';
import {NitrogenRichAsteroid} from '../../../src/cards/base/NitrogenRichAsteroid';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('NitrogenRichAsteroid', function() {
  it('Should play', function() {
    const card = new NitrogenRichAsteroid();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).eq(23);
    expect(game.getTemperature()).eq(-28);
    expect(player.getProduction(Resources.PLANTS)).eq(1);

    player.tagsForTest = {plant: 3};
    card.play(player);
    expect(player.getTerraformRating()).eq(26);
    expect(game.getTemperature()).eq(-26);
    expect(player.getProduction(Resources.PLANTS)).eq(5);
  });
});
