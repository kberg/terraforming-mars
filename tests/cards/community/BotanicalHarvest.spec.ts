import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {BotanicalHarvest} from '../../../src/cards/community/preludes/BotanicalHarvest';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('BotanicalHarvest', function() {
  let card : BotanicalHarvest; let player : Player; let game: Game;

  beforeEach(() => {
    card = new BotanicalHarvest();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const initialTR = player.getTerraformRating();
    card.play(player);

    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.plants).eq(5);
    expect(game.getOxygenLevel()).eq(1);
    expect(player.getTerraformRating()).eq(initialTR + 1);
  });
});
