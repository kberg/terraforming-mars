import {expect} from 'chai';
import {GiantIceAsteroid} from '../../../src/cards/base/GiantIceAsteroid';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('GiantIceAsteroid', function() {
  let card : GiantIceAsteroid; let player : Player; let player2 : Player; let player3 : Player; let game : Game;

  beforeEach(() => {
    card = new GiantIceAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.YELLOW.newPlayer();
    game = Game.newInstance('foobar', [player, player2, player3], player);
  });

  it('Should play', function() {
    player2.plants = 4;
    player3.plants = 6;
    card.play(player);
    expect(game.deferredActions).has.lengthOf(4);

    const firstOcean = game.deferredActions.pop()!.execute() as SelectSpace;
    firstOcean.cb(firstOcean.availableSpaces[0]);
    const secondOcean = game.deferredActions.pop()!.execute() as SelectSpace;
    secondOcean.cb(secondOcean.availableSpaces[1]);

    game.deferredActions.runNext(); // raise temperature

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    expect(orOptions.options).has.lengthOf(3);

    orOptions.options[0].cb();
    expect(player2.plants).eq(0);

    orOptions.options[1].cb();
    expect(player3.plants).eq(0);

    expect(game.getTemperature()).eq(-26);
    expect(player.getTerraformRating()).eq(24);
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST * 4;
    expect(player.canPlay(card)).is.true;
  });
});

