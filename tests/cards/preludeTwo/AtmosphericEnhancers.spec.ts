import {expect} from 'chai';
import {AtmosphericEnhancers} from '../../../src/cards/preludeTwo/AtmosphericEnhancers';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestingUtils} from '../../TestingUtils';

describe('AtmosphericEnhancers', function() {
  let card : AtmosphericEnhancers; let player : Player; let game: Game

  beforeEach(() => {
    card = new AtmosphericEnhancers();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({venusNextExtension: true}));
  });

  it('Play', function() {
    const orOptions = card.play(player) as OrOptions;

    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(2);

    // Raise temperature 2 steps
    orOptions.options[0].cb();
    expect(game.getTemperature()).eq(-26);
    expect(player.getTerraformRating()).eq(16);

    // Raise oxygen 2 steps
    orOptions.options[1].cb();
    expect(game.getOxygenLevel()).eq(2);
    expect(player.getTerraformRating()).eq(18);

    // Raise Venus 2 steps
    orOptions.options[2].cb();
    expect(game.getVenusScaleLevel()).eq(4);
    expect(player.getTerraformRating()).eq(20);
  });
});
